// Authentication system supporting both mock tokens (demo) and real JWT tokens
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key-change-in-production'

export interface User {
  id: string;
  name: string;
  role: 'user' | 'naccr';
  email: string;
}

interface JWTPayload {
  userId: string
  email: string
  role: 'user' | 'naccr'
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
  
  const token = authHeader.replace('Bearer ', '');
  
  // Try to verify as JWT token first (for real MongoDB users)
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    return {
      id: decoded.userId,
      name: decoded.email.split('@')[0], // Extract name from email
      email: decoded.email,
      role: decoded.role
    }
  } catch (jwtError) {
    // If JWT verification fails, try mock user lookup (for demo)
    const mockUser = users.find(user => user.id === token)
    if (mockUser) {
      return mockUser
    }
    return null
  }
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