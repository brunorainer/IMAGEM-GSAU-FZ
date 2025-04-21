import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Função para gerar código de acesso alfanumérico
export function generateAccessCode(length: number = 8): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removidos caracteres ambíguos como O, 0, 1, I
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

// Função para verificar se um código de acesso é válido
export function isValidAccessCode(code: string): boolean {
  // Verifica se o código tem o formato correto (alfanumérico, 8 caracteres)
  const codeRegex = /^[A-Z0-9]{8}$/;
  return codeRegex.test(code);
}

// Função para calcular a data de expiração (3 meses a partir da data atual)
export function calculateExpirationDate(date: Date = new Date()): Date {
  const expirationDate = new Date(date);
  expirationDate.setMonth(expirationDate.getMonth() + 3);
  return expirationDate;
}

// Função para verificar se um laudo expirou
export function isReportExpired(creationDate: Date): boolean {
  const expirationDate = calculateExpirationDate(creationDate);
  const currentDate = new Date();
  return currentDate > expirationDate;
}

// Função para formatar data
export function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR');
}
