export interface User {
    id: string;
    nome: string;
    email: string;
    senhaHash: string;
  }
  
  // Simulador de banco de dados
  export const usuariosDB: User[] = [];