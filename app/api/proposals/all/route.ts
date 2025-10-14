import { NextRequest, NextResponse } from 'next/server';
import { getAllJobs, initializeSampleData } from '@/lib/db';
import { getUserFromToken, getUserById } from '@/lib/auth';

export async function GET(request: NextRequest) {
  // Initialize sample data
  await initializeSampleData();
  
  try {
    const authHeader = request.headers.get('authorization');
    const user = getUserFromToken(authHeader);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (user.role !== 'naccr') {
      return NextResponse.json({ error: 'Only NACCR users can access this endpoint' }, { status: 403 });
    }
    
    const jobs = await getAllJobs();
    
    // Enrich jobs with user information
    const enrichedJobs = jobs.map(job => {
      const jobUser = getUserById(job.userId);
      return {
        ...job,
        userName: jobUser?.name || 'Unknown User',
        userEmail: jobUser?.email || 'Unknown Email',
      };
    });
    
    return NextResponse.json({ proposals: enrichedJobs });
  } catch (error) {
    console.error('Get all proposals error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}