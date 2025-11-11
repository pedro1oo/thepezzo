import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  GoogleAuthProvider,
  onAuthStateChanged
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../firebase/config';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isAuthorized: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Email autorizado para criar posts (substitua pelo seu email)
const AUTHORIZED_EMAIL = 'pedro.oferreira1504@gmail.com';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Configurando listener de autenticação...');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Estado da autenticação mudou:', user ? `Logado como ${user.email}` : 'Não logado');
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    console.log('Tentando fazer login com Google...');
    setLoading(true);
    
    try {
      const provider = new GoogleAuthProvider();
      
      // Configurar o provider para forçar a seleção de conta
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      console.log('Executando signInWithPopup...');
      const result = await signInWithPopup(auth, provider);
      console.log('Login bem-sucedido:', result.user.email);
      
    } catch (error: any) {
      console.error('Erro detalhado no login:', error);
      
      // Tratar diferentes tipos de erro
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Login cancelado pelo usuário');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Pop-up bloqueado pelo navegador. Permita pop-ups para este site.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        throw new Error('Solicitação de login cancelada');
      } else if (error.code === 'auth/network-request-failed') {
        throw new Error('Erro de rede. Verifique sua conexão.');
      } else if (error.message?.includes('CONFIGURATION_NOT_FOUND')) {
        throw new Error('❌ CONFIGURAÇÃO FALTANDO\n\nA autenticação Google não está habilitada no Firebase.\n\nSiga as instruções em: RESOLVER_ERRO_GOOGLE_AUTH.md');
      } else {
        throw new Error(`Falha no login: ${error.message || 'Erro desconhecido'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('Fazendo logout...');
      await firebaseSignOut(auth);
      console.log('Logout realizado com sucesso');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  };

  const isAuthorized = user?.email === AUTHORIZED_EMAIL;

  const value = {
    user,
    loading,
    signInWithGoogle,
    signOut,
    isAuthorized
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}