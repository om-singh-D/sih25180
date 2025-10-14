import { NextRequest, NextResponse } from 'next/server';
import { getJobById, initializeSampleData } from '@/lib/db';
import { getUserFromToken } from '@/lib/auth';
import { readFileSync } from 'fs';
import { join } from 'path';

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
    
    // Check if job is complete
    if (job.status !== 'complete') {
      return NextResponse.json({ error: 'Job not yet complete' }, { status: 400 });
    }
    
    // Read dummy result data
    const dummyResultPath = join(process.cwd(), 'dummyResult.json');
    const dummyResult = JSON.parse(readFileSync(dummyResultPath, 'utf8'));
    
    return NextResponse.json({
      jobId: job.id,
      title: job.title,
      filename: job.filename,
      submittedAt: job.submittedAt,
      completedAt: job.completedAt,
      result: dummyResult
    });
  } catch (error) {
    console.error('Get job result error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}