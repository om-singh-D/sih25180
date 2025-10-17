import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { getProposalByJobId } from '@/lib/proposals-db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const user = getUserFromToken(authHeader);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { jobId } = await params;
    console.log('Getting result for jobId:', jobId, 'User:', user.id);
    
    const proposal = await getProposalByJobId(jobId);
    
    if (!proposal) {
      console.error('Proposal not found for jobId:', jobId);
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }
    
    console.log('Found proposal:', { status: proposal.status, hasAnalysis: !!proposal.analysis });
    
    // Check if user has permission to view this proposal
    if (user.role === 'user' && proposal.userId !== user.id) {
      console.error('User permission denied. Proposal userId:', proposal.userId, 'Request userId:', user.id);
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Handle failed proposals
    if (proposal.status === 'failed') {
      console.log('Proposal failed. Error:', proposal.errorMessage);
      return NextResponse.json({ 
        error: 'Analysis failed',
        errorMessage: proposal.errorMessage || 'Unknown error occurred',
        jobId: proposal.jobId,
        title: proposal.title,
        status: 'failed'
      }, { status: 400 });
    }
    
    // Check if proposal is complete
    if (proposal.status !== 'complete') {
      console.log('Proposal not complete yet. Status:', proposal.status);
      return NextResponse.json({ error: 'Analysis not yet complete' }, { status: 400 });
    }
    
    // Return real Gemini analysis results
    return NextResponse.json({
      jobId: proposal.jobId,
      title: proposal.title,
      filename: proposal.fileName,
      submittedAt: proposal.createdAt.toISOString(),
      completedAt: proposal.updatedAt.toISOString(),
      result: proposal.analysis
    });
  } catch (error) {
    console.error('Get job result error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}