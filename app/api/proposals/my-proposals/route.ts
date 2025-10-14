import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { getProposalsByUser } from '@/lib/proposals-db';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const user = getUserFromToken(authHeader);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (user.role !== 'user') {
      return NextResponse.json({ error: 'Only users can access this endpoint' }, { status: 403 });
    }
    
    const proposals = await getProposalsByUser(user.id);
    
    console.log(`[my-proposals] User ${user.id} has ${proposals.length} proposals`);
    if (proposals.length > 0) {
      console.log('[my-proposals] Sample proposal:', {
        jobId: proposals[0].jobId,
        title: proposals[0].title,
        status: proposals[0].status,
      });
    }
    
    // Transform to match frontend expectations
    const formattedProposals = proposals.map(p => ({
      id: p.jobId,
      jobId: p.jobId,
      title: p.title,
      filename: p.fileName,
      status: p.status,
      createdAt: p.createdAt.toISOString(),
    }));
    
    return NextResponse.json({ proposals: formattedProposals });
  } catch (error) {
    console.error('Get my proposals error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}