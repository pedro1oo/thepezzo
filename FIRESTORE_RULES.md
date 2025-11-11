# Regras de Segurança do Firestore

Para o projeto Pezzo funcionar corretamente, você precisa configurar as regras de segurança no Firebase Console.

## Como Configurar:

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione o projeto "pezzo-b407c"
3. Vá em **Firestore Database**
4. Clique na aba **Rules**
5. Substitua as regras atuais pelo código abaixo:

## Regras para Desenvolvimento (Temporária)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura e escrita para todos (APENAS PARA DESENVOLVIMENTO)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ IMPORTANTE:** Essa regra é insegura e deve ser usada apenas para desenvolvimento/teste!

## Regras para Produção (Recomendadas)

Quando estiver pronto para produção, use estas regras mais seguras:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Posts podem ser lidos por todos, mas escritos apenas pelo autor
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (resource.data.userId == request.auth.uid || !exists(/databases/$(database)/documents/posts/$(postId)));
    }
  }
}
```

## Problemas Comuns e Soluções:

### 1. "Missing or insufficient permissions"
- **Causa:** Regras de segurança muito restritivas
- **Solução:** Use as regras de desenvolvimento acima

### 2. "The query requires an index"
- **Causa:** Firestore precisa criar índices para queries complexas
- **Solução:** O Firebase criará automaticamente ou sugerirá a criação

### 3. "Failed to get documents"
- **Causa:** Problemas de conectividade ou configuração
- **Solução:** Verifique se as credenciais estão corretas em `src/firebase/config.ts`

## Como Aplicar as Regras:

1. Copie o código das regras de desenvolvimento
2. Cole na aba **Rules** do Firestore
3. Clique em **Publish**
4. Aguarde a confirmação

## Verificação:

Após aplicar as regras, teste criando um post no seu app. Você deve ver mensagens no console do navegador como:

```
Inicializando posts, online: true
Tentando carregar do Firebase...
Iniciando sincronização...
Posts carregados do Firebase: 0
Configurando listener em tempo real...
Sincronização concluída
```

Se ainda houver erros, verifique o console do navegador (F12) para mais detalhes específicos.