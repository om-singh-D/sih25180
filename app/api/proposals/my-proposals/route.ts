import { NextRequest, NextResponse } from 'next/server';
import { getJobsByUserId, initializeSampleData } from '@/lib/db';
import { getUserFromToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  // Initialize sample data
  await initializeSampleData();
  
  try {
    const authHeader = request.headers.get('authorization');
    const user = getUserFromToken(authHeader);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (user.role !== 'user') {
      return NextResponse.json({ error: 'Only users can access this endpoint' }, { status: 403 });
    }
    
    const jobs = await getJobsByUserId(user.id);
    
    return NextResponse.json({ proposals: jobs });
  } catch (error) {
    console.error('Get my proposals error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}