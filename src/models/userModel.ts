import bcrypt from 'bcrypt';

// Criar o enum Role
export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface User {
  id: string;
  nome: string;
  email: string;
  senhaHash: string;
  role: Role; // Novo campo obrigatório
}

// Seu banco de dados em memória simulado
export const usuariosDB: User[] = [];