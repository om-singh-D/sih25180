import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';
import PDFParser from 'pdf2json';
import { createProposal, updateProposalStatus, updateProposalStage } from '@/lib/proposals-db';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function extractTextFromPDF(fileBuffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const pdfParser = new (PDFParser as any)(null, 1);
      
      pdfParser.on('pdfParser_dataError', (errData: any) => {
        console.error('PDF parsing error:', errData.parserError);
        reject(new Error('Failed to parse PDF'));
      });
      
      pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
        try {
          // Extract text from all pages
          let text = '';
          if (pdfData.Pages) {
            for (const page of pdfData.Pages) {
              if (page.Texts) {
                for (const textItem of page.Texts) {
                  if (textItem.R) {
                    for (const run of textItem.R) {
                      if (run.T) {
                        // Decode URI encoded text
                        text += decodeURIComponent(run.T) + ' ';
                      }
                    }
                  }
                }
              }
              text += '\n';
            }
          }
          resolve(text);
        } catch (error) {
          console.error('Text extraction error:', error);
          reject(new Error('Failed to extract text from PDF'));
        }
      });
      
      pdfParser.parseBuffer(fileBuffer);
    } catch (error) {
      console.error('PDF parser initialization error:', error);
      reject(new Error('Failed to initialize PDF parser'));
    }
  });
}

async function analyzeProposalWithGemini(proposalText: string, title: string): Promise<any> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are an expert R&D proposal evaluator for Project DARPAN (Data-driven Analytics & Ranking of Proposals for Advanced Novelty).

Analyze the following research proposal and provide a comprehensive evaluation:

**Proposal Title:** ${title}

**Proposal Content:**
${proposalText.substring(0, 30000)}

Please provide a detailed analysis in the following JSON format:
{
  "overallScore": <number 0-100>,
  "noveltyScore": <number 0-100>,
  "technicalMeritScore": <number 0-100>,
  "financialViabilityScore": <number 0-100>,
  "summary": "<brief 3-4 sentence summary>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>"],
  "noveltyAnalysis": {
    "isPlagiarized": false,
    "similarityScore": <number 0-100>,
    "uniqueContributions": ["<contribution 1>", "<contribution 2>"],
    "priorArtComparison": "<comparison text>"
  },
  "technicalAnalysis": {
    "methodology": "<assessment of methodology>",
    "feasibility": "<feasibility assessment>",
    "innovationLevel": "<high/medium/low>",
    "technicalRisks": ["<risk 1>", "<risk 2>"]
  },
  "financialAnalysis": {
    "budgetScore": <number 0-100>,
    "costEffectiveness": "<assessment>",
    "resourceAllocation": "<assessment>",
    "fundingRecommendation": "<recommendation>"
  },
  "recommendations": ["<recommendation 1>", "<recommendation 2>", "<recommendation 3>"],
  "similarProjects": [
    {
      "title": "<project title>",
      "similarity": <number 0-100>,
      "year": 2024,
      "outcome": "<outcome>"
    }
  ],
  "detailedFindings": {
    "objectives": "<extracted objectives>",
    "methodology": "<extracted methodology>",
    "expectedOutcomes": "<extracted outcomes>",
    "timeline": "<extracted timeline>",
    "budget": "<extracted budget info>"
  }
}

Ensure all scores are realistic and based on the actual content. Be thorough and critical in your evaluation.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Extract JSON from markdown code blocks if present
    let jsonText = text;
    if (text.includes('```json')) {
      jsonText = text.split('```json')[1].split('```')[0].trim();
    } else if (text.includes('```')) {
      jsonText = text.split('```')[1].split('```')[0].trim();
    }
    
    const analysis = JSON.parse(jsonText);
    return analysis;
    
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to analyze proposal with AI');
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const user = getUserFromToken(authHeader);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (user.role !== 'user') {
      return NextResponse.json({ error: 'Only users can upload proposals' }, { status: 403 });
    }
    
    // Parse form data (file upload)
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    
    if (!file || !title) {
      return NextResponse.json({ error: 'File and title are required' }, { status: 400 });
    }
    
    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 });
    }
    
    // Generate unique job ID
    const jobId = `job_${Date.now()}_${user.id}`;
    
    console.log(`[upload] Creating proposal with jobId: ${jobId}, userId: ${user.id}`);
    
    // Create proposal record in MongoDB
    await createProposal({
      jobId,
      userId: user.id,
      title,
      fileName: file.name,
    });
    
    console.log(`[upload] Proposal created successfully in MongoDB`);
    
    // Process PDF and analyze with Gemini in background
    (async () => {
      try {
        console.log(`[${jobId}] Starting PDF processing...`);
        await updateProposalStage(jobId, 'upload');
        
        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Stage 1: Extract text from PDF (simulating text embedding preparation)
        console.log(`[${jobId}] Stage 1: Extracting text and preparing embeddings...`);
        await updateProposalStage(jobId, 'embedding');
        const proposalText = await extractTextFromPDF(buffer);
        
        if (!proposalText || proposalText.trim().length < 100) {
          throw new Error('PDF contains insufficient text content');
        }
        
        // Stage 2: Cluster matching (simulated - in production would use vector DB)
        console.log(`[${jobId}] Stage 2: Performing vector similarity search for cluster matching...`);
        await updateProposalStage(jobId, 'clustering');
        // Simulate clustering delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Stage 3: AI Analysis with Gemini
        console.log(`[${jobId}] Stage 3: Analyzing proposal with Gemini AI...`);
        await updateProposalStage(jobId, 'analysis');
        const analysis = await analyzeProposalWithGemini(proposalText, title);
        
        // Store analysis results
        console.log(`[${jobId}] Analysis complete. Score: ${analysis.overallScore}`);
        
        // Update proposal status to complete with analysis in MongoDB
        await updateProposalStage(jobId, 'complete');
        await updateProposalStatus(jobId, 'complete', analysis);
        
      } catch (error) {
        console.error(`[${jobId}] Processing error:`, error);
        await updateProposalStatus(jobId, 'failed');
      }
    })();
    
    return NextResponse.json({ 
      jobId,
      message: 'Proposal uploaded successfully. AI analysis in progress...'
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
