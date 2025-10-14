import { NextRequest, NextResponse } from 'next/server';
import { getJobById, initializeSampleData } from '@/lib/db';
import { getUserFromToken } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  // Initialize sample data
  await initializeSampleData();
  
  try {
    const authHeader = request.headers.get('authorization');
    const user = getUserFromToken(authHeader);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { jobId } = await params;
    const job = await getJobById(jobId);
    
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    
    // Check if user has permission to view this job
    if (user.role === 'user' && job.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    return NextResponse.json({ 
      status: job.status,
      submittedAt: job.submittedAt,
      completedAt: job.completedAt 
    });
  } catch (error) {
    console.error('Get job status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}