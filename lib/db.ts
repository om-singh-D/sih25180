// Simple in-memory database for prototype
// In a real application, you would use MongoDB or another database

interface Job {
  id: string;
  userId: string;
  title: string;
  status: 'processing' | 'complete';
  submittedAt: Date;
  completedAt?: Date;
  filename: string;
}

// In-memory storage
let jobs: Job[] = [];

// Helper functions for job management
export async function createJob(jobId: string, data: { userId: string; title: string; filename: string }): Promise<Job> {
  const job: Job = {
    id: jobId,
    userId: data.userId,
    title: data.title,
    filename: data.filename,
    status: 'processing',
    submittedAt: new Date(),
  };
  
  jobs.push(job);
  return job;
}

export async function updateJobStatus(jobId: string, status: 'processing' | 'complete'): Promise<Job | null> {
  const jobIndex = jobs.findIndex(job => job.id === jobId);
  if (jobIndex === -1) return null;
  
  jobs[jobIndex].status = status;
  if (status === 'complete') {
    jobs[jobIndex].completedAt = new Date();
  }
  
  return jobs[jobIndex];
}

export async function getJobById(jobId: string): Promise<Job | null> {
  return jobs.find(job => job.id === jobId) || null;
}

export async function getJobsByUserId(userId: string): Promise<Job[]> {
  return jobs.filter(job => job.userId === userId);
}

export async function getAllJobs(): Promise<Job[]> {
  return jobs;
}

// Initialize with some sample data for demo purposes
export async function initializeSampleData() {
  if (jobs.length === 0) {
    const sampleJobs: Job[] = [
      {
        id: 'job_1728123456_user_123',
        userId: 'user_123',
        title: 'Methane Capture in Underground Mines',
        filename: 'methane_capture_proposal.pdf',
        status: 'complete',
        submittedAt: new Date(Date.now() - 3600000), // 1 hour ago
        completedAt: new Date(Date.now() - 600000), // 10 minutes ago
      },
      {
        id: 'job_1728123457_user_456',
        userId: 'user_456',
        title: 'Solar Panel Efficiency Enhancement',
        filename: 'solar_efficiency.pdf',
        status: 'processing',
        submittedAt: new Date(Date.now() - 1800000), // 30 minutes ago
      },
      {
        id: 'job_1728123458_user_123',
        userId: 'user_123',
        title: 'Wind Energy Storage Solutions',
        filename: 'wind_storage.pdf',
        status: 'complete',
        submittedAt: new Date(Date.now() - 7200000), // 2 hours ago
        completedAt: new Date(Date.now() - 3600000), // 1 hour ago
      },
    ];
    
    jobs = sampleJobs;
  }
}