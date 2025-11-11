# 🔧 Como Configurar Autenticação Google no Firebase

## ❌ ERRO ATUAL: `CONFIGURATION_NOT_FOUND`
Este erro indica que a autenticação Google não está habilitada no seu projeto Firebase.

## 🚀 PASSOS PARA RESOLVER:

### 1. Abra o Console do Firebase
- Vá para: https://console.firebase.google.com/project/pezzo-b407c

### 2. Habilite a Autenticação Google
1. No menu lateral, clique em **"Authentication"**
2. Clique na aba **"Sign-in method"** 
3. Na lista de provedores, encontre **"Google"**
4. Clique no **Google** e depois em **"Enable"**
5. Você precisará configurar:
   - **Project support email**: Seu email
   - **Project public-facing name**: "Pezzo"
6. Clique **"Save"**

### 3. Adicione Domínios Autorizados
Na mesma tela "Sign-in method", role para baixo até "Authorized domains":
- Adicione: `localhost` (para desenvolvimento)
- Se você publicar o site, adicione o domínio de produção

### 4. Atualize o Email Autorizado
Abra o arquivo: `src/contexts/AuthContext.tsx`
Na linha 9, substitua:
```typescript
const AUTHORIZED_EMAIL = 'seu-email@gmail.com';
```

Por:
```typescript
const AUTHORIZED_EMAIL = 'SEU_EMAIL_REAL_AQUI@gmail.com';
```

### 5. Atualize as Regras do Firestore
No Console Firebase:
1. Vá em **"Firestore Database"** 
2. Clique em **"Rules"**
3. Substitua o conteúdo por:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      // Todos podem ler
      allow read: if true;
      
      // Apenas seu email pode escrever
      allow write: if request.auth != null && 
                     request.auth.token.email == 'SEU_EMAIL_REAL_AQUI@gmail.com';
    }
  }
}
```

4. Clique **"Publish"**

## ✅ TESTE APÓS CONFIGURAR:
1. Reinicie o servidor: `npm run dev`
2. Clique no botão de login 🚀
3. Faça login com sua conta Google
4. Teste criar um post

## 🆘 Se ainda der erro:
- Verifique se está usando o email correto
- Abra o console do navegador (F12) e veja os erros
- Certifique-se que o domínio localhost está autorizado