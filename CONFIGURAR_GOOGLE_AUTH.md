# 🔧 INSTRUÇÕES PARA CONFIGURAR AUTENTICAÇÃO GOOGLE

## ⚠️ PROBLEMA IDENTIFICADO
O erro "Falha no login" geralmente ocorre porque a autenticação Google não está configurada no Firebase Console.

## 📋 PASSOS PARA RESOLVER:

### 1. Acesse o Firebase Console
Vá para: https://console.firebase.google.com/project/pezzo-b407c

### 2. Configure a Autenticação
1. No painel lateral, clique em **"Authentication"**
2. Vá na aba **"Sign-in method"**
3. Encontre **"Google"** na lista de provedores
4. Clique em **"Google"** para configurar

### 3. Habilite o Google Auth
1. Ative o toggle **"Enable"**
2. Configure o **"Project support email"** (coloque seu email)
3. Clique em **"Save"**

### 4. Configure os Domínios Autorizados
1. Ainda na seção Authentication
2. Vá na aba **"Settings"** > **"Authorized domains"**
3. Adicione os domínios:
   - `localhost`
   - `127.0.0.1`
   - Qualquer domínio onde você vai hospedar o app

### 5. Atualize seu Email Autorizado
No arquivo `src/contexts/AuthContext.tsx`, linha 18, altere:
```typescript
const AUTHORIZED_EMAIL = 'seu-email@gmail.com'; // 🔴 ALTERE AQUI PARA SEU EMAIL
```

Para o email que você vai usar para fazer login (o mesmo email do Google).

## 🧪 TESTE APÓS CONFIGURAR:
1. Recarregue a página do app
2. Clique no botão de login (🚀)
3. Teste o login com Google

## 🔍 POSSÍVEIS PROBLEMAS EXTRAS:

### Se ainda não funcionar:
1. Verifique se não há bloqueador de pop-ups no navegador
2. Tente em uma aba anônima/incógnita
3. Verifique o console do navegador (F12) para mais detalhes

### Logs úteis:
O sistema agora mostra logs detalhados no console do navegador. Abra o DevTools (F12) e veja a aba Console para mais informações.

## 📱 REGRAS DE FIRESTORE ATUALIZADAS:
Quando você fizer login pela primeira vez, as regras já estão configuradas para:
- ✅ Qualquer pessoa pode LER posts
- ✅ Apenas usuários autenticados podem ESCREVER posts  
- ✅ Verificação de email autorizado no frontend

---
**Após configurar tudo, teste o login e me informe se funcionou! 🚀**