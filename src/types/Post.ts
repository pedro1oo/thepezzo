export interface Post {
  id: string;
  title: string;
  content: string;
  date: Date;
  tags?: string[];
  mood?: 'positive' | 'neutral' | 'contemplative' | 'ambitious';
  likes?: string[]; // Array de user IDs que curtiram o post
  likeCount?: number; // Contador de likes para performance
}

export interface PostFormData {
  title: string;
  content: string;
  tags?: string[];
  mood?: Post['mood'];
}