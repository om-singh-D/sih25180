// API client utility functions

export interface User {
  id: string;
  name: string;
  role: 'user' | 'naccr';
  email: string;
}

export interface Proposal {
  id: string;
  userId: string;
  title: string;
  filename: string;
  status: 'processing' | 'complete' | 'failed';
  submittedAt: string;
  completedAt?: string;
  userName?: string;
  userEmail?: string;
  errorMessage?: string;
}

export interface AnalysisResult {
  score: number;
  summary: string;
  noveltyAnalysis: {
    isNovel: boolean;
    justification: string;
    similarProjects: Array<{
      id: string;
      title: string;
      similarity: string;
    }>;
  };
  financialAnalysis: {
    isCompliant: boolean;
    justification: string;
  };
}

const API_BASE = '/api';

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  getToken(): string | null {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  private async request(url: string, options: RequestInit = {}) {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (token) {
      // Ensure token is sent with Bearer prefix
      headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Request failed');
    }

    return response.json();
  }

  // Auth endpoints
  async getUsers(): Promise<{ users: User[] }> {
    return this.request('/auth/login');
  }

  async login(userId: string): Promise<{ user: User; token: string }> {
    const result = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
    this.setToken(result.token);
    return result;
  }

  // Proposal endpoints
  async uploadProposal(file: File, title: string): Promise<{ jobId: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);

    const token = this.getToken();
    const headers: Record<string, string> = {};
    if (token) {
      // Ensure token is sent with Bearer prefix
      headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/proposals/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Upload failed');
    }

    return response.json();
  }

  async getMyProposals(): Promise<{ proposals: Proposal[] }> {
    return this.request('/proposals/my-proposals');
  }

  async getAllProposals(): Promise<{ proposals: Proposal[] }> {
    return this.request('/proposals/all');
  }

  async getProposalStatus(jobId: string): Promise<{ status: string; submittedAt: string; completedAt?: string }> {
    return this.request(`/proposals/${jobId}/status`);
  }

  async getProposalResult(jobId: string): Promise<{
    jobId: string;
    title: string;
    filename: string;
    submittedAt: string;
    completedAt: string;
    result: AnalysisResult;
  }> {
    return this.request(`/proposals/${jobId}/result`);
  }
}

export const apiClient = new ApiClient();