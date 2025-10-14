// Simple authentication system for prototype
// In a real app, you'd use proper JWT tokens, sessions, etc.

export interface User {
  id: string;
  name: string;
  role: 'user' | 'naccr';
  email: string;
}

// Mock users for demo
const users: User[] = [
  {
    id: 'user_123',
    name: 'John Doe',
    role: 'user',
    email: 'john.doe@example.com',
  },
  {
    id: 'user_456',
    name: 'Jane Smith',
    role: 'user',
    email: 'jane.smith@example.com',
  },
  {
    id: 'naccr_789',
    name: 'NACCR Admin',
    role: 'naccr',
    email: 'admin@naccr.gov.in',
  },
];

export function getUserFromToken(authHeader: string | null): User | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  // In a real app, you'd verify the JWT token here
  // For demo purposes, we'll use simple token format: "Bearer userId"
  const token = authHeader.replace('Bearer ', '');
  
  return users.find(user => user.id === token) || null;
}

export function generateMockToken(userId: string): string {
  return `Bearer ${userId}`;
}

export function getAllUsers(): User[] {
  return users;
}

export function getUserById(userId: string): User | null {
  return users.find(user => user.id === userId) || null;
}