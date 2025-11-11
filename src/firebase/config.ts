import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  enableNetwork,
  disableNetwork
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Configuração do Firebase - Projeto Pezzo
const firebaseConfig = {
  apiKey: "AIzaSyB4oxQlle2p0uaVEuOvFWY-HFR7cJlLkjo",
  authDomain: "pezzo-b407c.firebaseapp.com",
  projectId: "pezzo-b407c",
  storageBucket: "pezzo-b407c.firebasestorage.app",
  messagingSenderId: "898613305056",
  appId: "1:898613305056:web:4d5ce2c07d31ee3440fa85",
  measurementId: "G-XTC4FCSTRF"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
export const db = getFirestore(app);

// Inicializar Auth
export const auth = getAuth(app);

// Inicializar Analytics (opcional)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Funções utilitárias para conectividade
export const enableFirestore = () => enableNetwork(db);
export const disableFirestore = () => disableNetwork(db);

export default app;