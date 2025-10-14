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
    const proposal = await getProposalByJobId(jobId);
    
    if (!proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }
    
    // Check if user has permission to view this proposal
    if (user.role === 'user' && proposal.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    return NextResponse.json({ 
      status: proposal.status,
      currentStage: proposal.currentStage || 'upload',
      submittedAt: proposal.createdAt.toISOString(),
      completedAt: proposal.updatedAt.toISOString()
    });
  } catch (error) {
    console.error('Get proposal status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}