import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function DELETE(request: NextRequest) {
  try {
    // Optional: Add authentication check here
    // const authHeader = request.headers.get('authorization');
    // if (!authHeader) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const client = await clientPromise;
    const db = client.db('darpan');
    
    // Delete all proposals
    const result = await db.collection('proposals').deleteMany({});
    
    console.log(`[clear] Deleted ${result.deletedCount} proposals from database`);
    
    return NextResponse.json({ 
      success: true,
      message: `Successfully deleted ${result.deletedCount} proposals`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Clear database error:', error);
    return NextResponse.json({ 
      error: 'Failed to clear database',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
