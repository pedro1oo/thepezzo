import { postsService } from '../firebase/postsService';

// Função para testar conexão com Firebase
export const testFirebaseConnection = async (): Promise<void> => {
  try {
    console.log('=== TESTE DE CONEXÃO FIREBASE ===');
    
    // Teste 1: Tentar criar um post simples
    console.log('1. Testando criação de post...');
    const testPost = {
      title: 'Teste de Conexão',
      content: 'Este é um post de teste para verificar a conexão com o Firebase.',
      tags: ['teste'],
      mood: 'neutral' as const
    };
    
    const postId = await postsService.createPost(testPost);
    console.log('✅ Post criado com sucesso! ID:', postId);
    
    // Teste 2: Tentar ler posts
    console.log('2. Testando leitura de posts...');
    const posts = await postsService.getPosts();
    console.log('✅ Posts lidos com sucesso! Quantidade:', posts.length);
    
    // Teste 3: Tentar deletar o post de teste
    console.log('3. Testando deleção de post...');
    await postsService.deletePost(postId);
    console.log('✅ Post deletado com sucesso!');
    
    console.log('=== TODOS OS TESTES PASSARAM! ===');
    alert('✅ Firebase conectado e funcionando perfeitamente!');
    
  } catch (error) {
    console.error('❌ ERRO NO TESTE:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('permission')) {
        alert('❌ Erro de Permissão!\n\nVocê precisa configurar as regras do Firestore.\nVeja o arquivo FIRESTORE_RULES.md');
      } else if (error.message.includes('network')) {
        alert('❌ Erro de Conexão!\n\nVerifique sua internet e as credenciais do Firebase.');
      } else {
        alert(`❌ Erro: ${error.message}`);
      }
    }
    
    throw error;
  }
};