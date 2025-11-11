export interface Post {
  id: string;
  title: string;
  content: string;
  date: Date;
  tags?: string[];
  mood?: 'positive' | 'neutral' | 'contemplative' | 'ambitious';
}

export interface PostFormData {
  title: string;
  content: string;
  tags?: string[];
  mood?: Post['mood'];
}