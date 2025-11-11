export interface Comment {
  id: string;
  postId: string; // ID do post ao qual o comentário pertence
  authorId: string; // UID do usuário que comentou
  authorName: string; // Nome do usuário para exibição
  authorPhoto?: string; // Foto do usuário (opcional)
  content: string; // Conteúdo do comentário
  date: Date; // Data de criação
}

export interface CommentFormData {
  content: string;
}

// Interface para comentário no Firebase (com Timestamp)
export interface FirebaseComment {
  id?: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  content: string;
  date: any; // Timestamp do Firebase
}