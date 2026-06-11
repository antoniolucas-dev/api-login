export interface Tarefa {
  id: string;
  userId: string; // Amarração da tarefa ao usuário dono dela
  titulo: string;
  concluida: boolean;
}

export const tarefasDB: Tarefa[] = [];