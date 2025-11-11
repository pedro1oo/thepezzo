import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db, auth } from './config';
import type { Post, PostFormData } from '../types/Post';

// Email autorizado (deve corresponder ao AuthContext)
const AUTHORIZED_EMAIL = 'pedro.oferreira1504@gmail.com';

// Interface para posts no Firebase (com Timestamp)
interface FirebasePost {
  id?: string;
  title: string;
  content: string;
  date: Timestamp;
  tags?: string[];
  mood?: Post['mood'];
  authorEmail?: string;
}

// Verificar se usuário está autorizado
const checkAuthorization = (operation: string = 'operação'): void => {
  const user = auth.currentUser;
  if (!user || user.email !== AUTHORIZED_EMAIL) {
    throw new Error(`❌ Acesso negado para ${operation}. Apenas o autor pode criar ou editar posts.`);
  }
};

// Converter Post para formato Firebase
const postToFirebase = (post: PostFormData): Omit<FirebasePost, 'id'> => {
  const user = auth.currentUser;
  return {
    title: post.title || '',
    content: post.content || '',
    tags: post.tags || [],
    mood: post.mood || 'neutral',
    date: serverTimestamp() as Timestamp,
    authorEmail: user?.email || ''
  };
};

// Converter documento Firebase para Post
const firebaseToPost = (doc: any): Post => ({
  id: doc.id,
  title: doc.data().title,
  content: doc.data().content,
  date: doc.data().date?.toDate() || new Date(),
  tags: doc.data().tags || [],
  mood: doc.data().mood || 'neutral',
  likes: doc.data().likes || [],
  likeCount: doc.data().likes?.length || 0
});

// Nome da coleção
const POSTS_COLLECTION = 'posts';

// Serviços do Firebase
export const postsService = {
  // Criar um novo post
  async createPost(postData: PostFormData): Promise<string> {
    try {
      console.log('Verificando autorização para criar post...');
      checkAuthorization('criação de posts');
      
      console.log('Tentando criar post:', postData);
      const postForFirebase = postToFirebase(postData);
      
      console.log('Executando addDoc...');
      const docRef = await addDoc(
        collection(db, POSTS_COLLECTION),
        postForFirebase
      );
      
      console.log('Post criado com sucesso, ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Erro detalhado ao criar post:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('❌ Acesso negado')) {
          throw error; // Re-throw authorization error as is
        } else if (error.message.includes('permission')) {
          throw new Error('❌ ERRO DE PERMISSÃO\n\nVocê precisa configurar as regras do Firestore.\n\nVá em: https://console.firebase.google.com/project/pezzo-b407c/firestore/rules');
        } else if (error.message.includes('network')) {
          throw new Error('Erro de conexão - verifique sua internet');
        } else {
          throw new Error(`Falha ao criar post: ${error.message}`);
        }
      }
      
      throw new Error('Falha ao criar post - erro desconhecido');
    }
  },

  // Obter todos os posts (qualquer pessoa pode ver)
  async getPosts(): Promise<Post[]> {
    try {
      const q = query(
        collection(db, POSTS_COLLECTION),
        orderBy('date', 'desc')
      );

      console.log('Executando query no Firestore...');
      const querySnapshot = await getDocs(q);
      console.log('Posts encontrados:', querySnapshot.docs.length);
      
      return querySnapshot.docs.map(firebaseToPost);
    } catch (error) {
      console.error('Erro detalhado ao buscar posts:', error);
      // Se for erro de permissão ou índice, retorna array vazio
      if (error instanceof Error) {
        if (error.message.includes('permission') || error.message.includes('index')) {
          console.warn('Problema de permissão ou índice, retornando posts vazios');
          return [];
        }
      }
      throw new Error('Falha ao carregar posts');
    }
  },

  // Atualizar um post (apenas usuário autorizado)
  async updatePost(id: string, postData: Partial<PostFormData>): Promise<void> {
    try {
      console.log('Verificando autorização para editar post...');
      checkAuthorization('edição de posts');
      
      const docRef = doc(db, POSTS_COLLECTION, id);
      await updateDoc(docRef, {
        ...postData,
        date: serverTimestamp()
      });
    } catch (error) {
      console.error('Erro ao atualizar post:', error);
      if (error instanceof Error && error.message.includes('❌ Acesso negado')) {
        throw error;
      }
      throw new Error('Falha ao atualizar post');
    }
  },

  // Deletar um post (apenas usuário autorizado)
  async deletePost(id: string): Promise<void> {
    try {
      console.log('Verificando autorização para deletar post...');
      checkAuthorization('exclusão de posts');
      
      await deleteDoc(doc(db, POSTS_COLLECTION, id));
    } catch (error) {
      console.error('Erro ao deletar post:', error);
      if (error instanceof Error && error.message.includes('❌ Acesso negado')) {
        throw error;
      }
      throw new Error('Falha ao deletar post');
    }
  },

  // Escutar mudanças em tempo real (qualquer pessoa pode ver)
  subscribeToPostsChanges(
    callback: (posts: Post[]) => void,
    onError?: (error: Error) => void
  ) {
    try {
      const q = query(
        collection(db, POSTS_COLLECTION),
        orderBy('date', 'desc')
      );

      console.log('Configurando listener em tempo real...');

      return onSnapshot(
        q,
        (querySnapshot) => {
          console.log('Mudança detectada, posts:', querySnapshot.docs.length);
          const posts = querySnapshot.docs.map(firebaseToPost);
          callback(posts);
        },
        (error) => {
          console.error('Erro no listener em tempo real:', error);
          if (onError) onError(new Error('Falha na sincronização em tempo real'));
        }
      );
    } catch (error) {
      console.error('Erro ao configurar listener:', error);
      if (onError) onError(new Error('Falha ao configurar sincronização'));
      return () => {}; // Retorna função vazia se houver erro
    }
  },

  // Curtir um post (usuário deve estar logado)
  async likePost(postId: string): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('❌ Você precisa estar logado para curtir posts');
      }

      console.log(`Curtindo post ${postId} como ${user.email}...`);
      const docRef = doc(db, POSTS_COLLECTION, postId);
      
      await updateDoc(docRef, {
        likes: arrayUnion(user.uid)
      });
      
      console.log('Post curtido com sucesso!');
    } catch (error) {
      console.error('Erro ao curtir post:', error);
      if (error instanceof Error && error.message.includes('❌')) {
        throw error;
      }
      throw new Error('Falha ao curtir post');
    }
  },

  // Descurtir um post (usuário deve estar logado)
  async unlikePost(postId: string): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('❌ Você precisa estar logado para descurtir posts');
      }

      console.log(`Descurtindo post ${postId} como ${user.email}...`);
      const docRef = doc(db, POSTS_COLLECTION, postId);
      
      await updateDoc(docRef, {
        likes: arrayRemove(user.uid)
      });
      
      console.log('Post descurtido com sucesso!');
    } catch (error) {
      console.error('Erro ao descurtir post:', error);
      if (error instanceof Error && error.message.includes('❌')) {
        throw error;
      }
      throw new Error('Falha ao descurtir post');
    }
  }
};