# 🚀 CONFIGURAÇÃO FIREBASE - PEDRO

## ✅ Email configurado: pedro.oferreira1504@gmail.com

## 📋 CHECKLIST PARA CONFIGURAR:

### 1. 🔑 Habilitar Autenticação Google
Vá para: https://console.firebase.google.com/project/pezzo-b407c/authentication/providers

1. Clique na aba **"Sign-in method"**
2. Encontre **"Google"** na lista
3. Clique em **"Google"** → **"Enable"**
4. Configure:
   - **Project support email**: pedro.oferreira1504@gmail.com
   - **Project public-facing name**: Pezzo
5. Clique **"Save"**

### 2. 🌐 Adicionar Domínios Autorizados
Na mesma página, em "Authorized domains":
- Certifique-se que `localhost` está na lista
- Se não estiver, clique **"Add domain"** e adicione `localhost`

### 3. 🔒 Configurar Regras do Firestore
Vá para: https://console.firebase.google.com/project/pezzo-b407c/firestore/rules

Substitua TODO o conteúdo das regras por:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      // Todos podem ler os posts
      allow read: if true;
      
      // Apenas Pedro pode criar/editar/deletar
      allow write: if request.auth != null && 
                     request.auth.token.email == 'pedro.oferreira1504@gmail.com';
    }
  }
}
```

Clique **"Publish"** para salvar.

## ✅ TESTE FINAL:
1. Reinicie o servidor: `Ctrl+C` no terminal e depois `npm run dev`
2. Abra o site: http://localhost:5174
3. Clique no botão 🚀 para fazer login
4. Use sua conta Google (pedro.oferreira1504@gmail.com)
5. Você deve ver um ✓ verde indicando autorização
6. Tente criar um novo post!

## 🆘 Se der erro:
- Verifique se completou TODOS os 3 passos acima
- Abra F12 (console do navegador) para ver erros específicos
- Certifique-se de usar exatamente o email: pedro.oferreira1504@gmail.com