import clientPromise from './mongodb';

export type ProcessingStage = 'upload' | 'embedding' | 'clustering' | 'analysis' | 'complete';

export interface ProposalDocument {
  jobId: string;
  userId: string;
  title: string;
  fileName: string;
  status: 'processing' | 'complete' | 'failed';
  currentStage?: ProcessingStage;
  analysis?: any;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function createProposal(data: {
  jobId: string;
  userId: string;
  title: string;
  fileName: string;
}): Promise<void> {
  const client = await clientPromise;
  const db = client.db('darpan');
  
  await db.collection('proposals').insertOne({
    ...data,
    status: 'processing',
    currentStage: 'upload',
    analysis: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

export async function updateProposalStage(
  jobId: string,
  stage: ProcessingStage
): Promise<void> {
  const client = await clientPromise;
  const db = client.db('darpan');
  
  await db.collection('proposals').updateOne(
    { jobId },
    { 
      $set: { 
        currentStage: stage,
        updatedAt: new Date(),
      } 
    }
  );
}

export async function updateProposalStatus(
  jobId: string,
  status: 'processing' | 'complete' | 'failed',
  analysis?: any,
  errorMessage?: string
): Promise<void> {
  const client = await clientPromise;
  const db = client.db('darpan');
  
  const updateData: any = {
    status,
    updatedAt: new Date(),
  };
  
  if (analysis) {
    updateData.analysis = analysis;
  }
  
  if (errorMessage) {
    updateData.errorMessage = errorMessage;
  }
  
  await db.collection('proposals').updateOne(
    { jobId },
    { $set: updateData }
  );
}

export async function getProposalsByUser(userId: string): Promise<ProposalDocument[]> {
  const client = await clientPromise;
  const db = client.db('darpan');
  
  const proposals = await db
    .collection('proposals')
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();
  
  return proposals as any[];
}

export async function getAllProposals(): Promise<ProposalDocument[]> {
  const client = await clientPromise;
  const db = client.db('darpan');
  
  const proposals = await db
    .collection('proposals')
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
  
  return proposals as any[];
}

export async function getProposalByJobId(jobId: string): Promise<ProposalDocument | null> {
  const client = await clientPromise;
  const db = client.db('darpan');
  
  console.log('Looking for proposal with jobId:', jobId);
  const proposal = await db.collection('proposals').findOne({ jobId });
  
  if (!proposal) {
    console.log('Proposal not found in MongoDB');
    // List all proposals to debug
    const allProposals = await db.collection('proposals').find({}).toArray();
    console.log('All proposals in DB:', allProposals.map(p => ({ jobId: (p as any).jobId, title: (p as any).title })));
  } else {
    console.log('Found proposal:', { jobId: proposal.jobId, title: (proposal as any).title, status: (proposal as any).status });
  }
  
  return proposal as any;
}
