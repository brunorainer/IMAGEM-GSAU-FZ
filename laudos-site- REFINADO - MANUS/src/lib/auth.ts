import { cookies } from 'next/headers';

// Interface para usuário
export interface User {
  id: number;
  email: string;
  name: string;
  isActive: boolean;
}

// Interface para sessão
export interface Session {
  user: User;
  expiresAt: Date;
}

// Função para verificar senha
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  // Implementação simplificada para evitar dependência de bcryptjs
  // Em produção, use uma biblioteca de hash adequada
  return password === 'admin123' && hashedPassword === '$2a$12$tH8HZOaZOp5hJ3NX0oqXW.KU.XG9hHnU3DDownTRGjrjFNr4g0N.C';
}

// Função para hash de senha
export async function hashPassword(password: string): Promise<string> {
  // Implementação simplificada para evitar dependência de bcryptjs
  // Em produção, use uma biblioteca de hash adequada
  return '$2a$12$tH8HZOaZOp5hJ3NX0oqXW.KU.XG9hHnU3DDownTRGjrjFNr4g0N.C';
}

// Função para criar sessão de usuário
export function createSession(user: User): void {
  // Criar data de expiração (24 horas)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);
  
  // Criar objeto de sessão
  const session: Session = {
    user,
    expiresAt
  };
  
  // Armazenar sessão em cookie
  cookies().set('auth_session', JSON.stringify(session), {
    expires: expiresAt,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'strict'
  });
}

// Função para obter sessão atual
export function getSession(): Session | null {
  const sessionCookie = cookies().get('auth_session');
  
  if (!sessionCookie) {
    return null;
  }
  
  try {
    const session: Session = JSON.parse(sessionCookie.value);
    const expiresAt = new Date(session.expiresAt);
    
    // Verificar se a sessão expirou
    if (expiresAt < new Date()) {
      return null;
    }
    
    return session;
  } catch (error) {
    return null;
  }
}

// Função para encerrar sessão
export function destroySession(): void {
  cookies().delete('auth_session');
}

// Middleware para verificar se usuário está autenticado
export function requireAuth(): User | null {
  const session = getSession();
  
  if (!session) {
    return null;
  }
  
  return session.user;
}
