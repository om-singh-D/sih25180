import { NextRequest, NextResponse } from 'next/server';
import { createJob, updateJobStatus, initializeSampleData } from '@/lib/db';
import { getUserFromToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  // Initialize sample data
  await initializeSampleData();
  
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
    
    // Generate unique job ID
    const jobId = `job_${Date.now()}_${user.id}`;
    
    // Create job record
    await createJob(jobId, {
      userId: user.id,
      title,
      filename: file.name,
    });
    
    // Simulate processing time with setTimeout
    setTimeout(async () => {
      console.log(`Job ${jobId} finished processing.`);
      await updateJobStatus(jobId, 'complete');
    }, 5000); // 5 seconds for demo
    
    return NextResponse.json({ jobId });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}