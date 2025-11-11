# Configuração Firebase - Pezzo

## Passo a Passo para Configurar o Firebase

### 1. Criar Projeto Firebase
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Digite o nome: "Pezzo" (ou o que preferir)
4. Desabilite o Google Analytics (opcional)
5. Clique em "Criar projeto"

### 2. Configurar Firestore Database
1. No painel do Firebase, vá em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de teste" (por enquanto)
4. Selecione a localização mais próxima (us-central1 ou southamerica-east1)

### 3. Configurar Autenticação (Opcional)
1. Vá em "Authentication"
2. Clique em "Começar"
3. Na aba "Sign-in method", habilite "Anônimo" para começar

### 4. Configurar App Web
1. No painel principal, clique no ícone web (</>)
2. Digite o nome do app: "Pezzo Web"
3. NÃO marque "Configure Firebase Hosting"
4. Clique em "Registrar app"
5. **COPIE as configurações mostradas**

### 5. Atualizar Configuração no Código
Abra o arquivo `src/firebase/config.ts` e substitua as configurações:

```typescript
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### 6. Configurar Regras de Segurança
No Firestore, vá em "Rules" e use esta configuração temporária:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura e escrita para todos (temporário)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ IMPORTANTE:** Essas regras são para desenvolvimento. Para produção, implemente autenticação adequada.

### 7. Regras de Segurança para Produção
Quando estiver pronto para produção, use regras mais seguras:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Posts só podem ser lidos por todos, mas escritos pelo próprio usuário
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

## Recursos Implementados

✅ **Sincronização em Tempo Real**: Posts aparecem automaticamente em todos os dispositivos
✅ **Modo Offline**: Funciona sem internet, sincroniza quando conecta
✅ **Status de Conectividade**: Mostra quando está online/offline
✅ **Backup/Restore**: Exportar/importar dados em JSON
✅ **Multi-dispositivo**: Acesse de qualquer lugar

## Próximos Passos

1. **Autenticação**: Implementar login com Google/email
2. **Perfis**: Permitir múltiplos usuários
3. **Categorias**: Organizar posts por categorias
4. **Busca**: Buscar posts por título/conteúdo/tags
5. **PWA**: Transformar em Progressive Web App

## Estrutura de Dados

```typescript
// Documento de Post no Firestore
{
  id: string,           // ID automático do Firestore
  title: string,        // Título do post
  content: string,      // Conteúdo do post
  date: Timestamp,      // Data de criação/atualização
  tags: string[],       // Array de tags
  mood: string,         // Estado de espírito
  userId: string        // ID do usuário (para futuro)
}
```