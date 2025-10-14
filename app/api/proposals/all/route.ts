import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken, getUserById } from '@/lib/auth';
import { getAllProposals } from '@/lib/proposals-db';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const user = getUserFromToken(authHeader);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (user.role !== 'naccr') {
      return NextResponse.json({ error: 'Only NACCR users can access this endpoint' }, { status: 403 });
    }
    
    const proposals = await getAllProposals();
    
    // Enrich proposals with user information and format for frontend
    const enrichedProposals = proposals.map(proposal => {
      const proposalUser = getUserById(proposal.userId);
      
      // Extract scores from analysis if available
      const analysis = proposal.analysis;
      const overallScore = analysis?.overallScore || null;
      const noveltyScore = analysis?.noveltyScore || null;
      const technicalMeritScore = analysis?.technicalMeritScore || null;
      
      // Determine cluster based on proposal content (simplified)
      const cluster = determineCluster(proposal.title, analysis);
      
      return {
        id: proposal.jobId,
        jobId: proposal.jobId,
        title: proposal.title,
        filename: proposal.fileName,
        status: proposal.status,
        submittedAt: proposal.createdAt.toISOString(),
        completedAt: proposal.updatedAt.toISOString(),
        userName: proposalUser?.name || 'Unknown User',
        userEmail: proposalUser?.email || 'Unknown Email',
        overallScore,
        noveltyScore,
        technicalMeritScore,
        cluster,
      };
    });
    
    return NextResponse.json({ proposals: enrichedProposals });
  } catch (error) {
    console.error('Get all proposals error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to determine cluster based on content
function determineCluster(title: string, analysis: any): string {
  const titleLower = title.toLowerCase();
  
  // Research area keywords
  const clusters: { [key: string]: string[] } = {
    'AI & Machine Learning': ['ai', 'artificial intelligence', 'machine learning', 'deep learning', 'neural', 'nlp'],
    'Biotechnology': ['bio', 'genetic', 'dna', 'protein', 'medical', 'pharmaceutical', 'drug'],
    'Renewable Energy': ['solar', 'wind', 'renewable', 'energy', 'sustainable', 'green', 'battery'],
    'Quantum Computing': ['quantum', 'qubit', 'superposition', 'entanglement'],
    'Robotics': ['robot', 'automation', 'autonomous', 'drone', 'mechanical'],
    'Data Science': ['data', 'analytics', 'big data', 'statistics', 'visualization'],
    'Cybersecurity': ['security', 'encryption', 'cyber', 'privacy', 'blockchain'],
    'IoT & Sensors': ['iot', 'sensor', 'smart', 'connected', 'wireless'],
    'Materials Science': ['material', 'nano', 'polymer', 'composite', 'graphene'],
    'Environmental Science': ['environment', 'climate', 'pollution', 'ecology', 'conservation'],
  };
  
  for (const [cluster, keywords] of Object.entries(clusters)) {
    if (keywords.some(keyword => titleLower.includes(keyword))) {
      return cluster;
    }
  }
  
  return 'Other';
}