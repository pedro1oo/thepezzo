rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Regras para a coleção de posts
    match /posts/{postId} {
      // Todos podem ler os posts (visitantes podem ver o blog)
      allow read: if true;
      
      // Apenas usuários autenticados com email autorizado podem criar, editar e deletar
      allow write: if request.auth != null && 
                     request.auth.token.email == 'pedro.oferreira1504@gmail.com';
    }
  }
}