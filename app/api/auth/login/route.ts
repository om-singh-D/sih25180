import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers, generateMockToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    const users = getAllUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const token = generateMockToken(userId);
    
    return NextResponse.json({
      user,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  // Return list of available users for demo
  const users = getAllUsers();
  return NextResponse.json({ users });
}