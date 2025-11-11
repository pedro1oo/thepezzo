# 🚀 Pezzo - Pensamentos em Órbita

Um blog pessoal moderno e elegante inspirado no design da SpaceX para registrar seus pensamentos diários. Construído com React, TypeScript e Firebase para sincronização multi-dispositivo.

![Pezzo Banner](https://via.placeholder.com/1200x400/000000/0ea5e9?text=PEZZO+-+Pensamentos+em+%C3%93rbita)

## ✨ Características

- **🎨 Design SpaceX-Inspired**: Interface futurista com tema escuro e elementos espaciais
- **📱 Multi-dispositivo**: Acesse seus posts de qualquer dispositivo com sincronização em tempo real
- **🔄 Modo Offline**: Funciona sem internet, sincroniza automaticamente quando conecta
- **💾 Backup/Restore**: Exporte e importe seus dados em formato JSON
- **📝 Cards Interativos**: Posts organizados em cards elegantes com animações
- **🏷️ Sistema de Tags**: Organize seus pensamentos com tags personalizadas
- **😊 Estados de Humor**: Associe emojis aos seus posts (🚀 Positivo, 🌌 Contemplativo, ⭐ Ambicioso, 🛸 Neutro)
- **⚡ Performance**: Construído com Vite para desenvolvimento rápido e build otimizado

## 🛠️ Tecnologias

- **Frontend**: React 19 + TypeScript
- **Styling**: CSS Custom Properties com tema SpaceX
- **Database**: Firebase Firestore
- **Build Tool**: Vite
- **Icons**: Emoji + SVG customizados
- **Fonts**: Orbitron (display) + Inter (body)

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta no Firebase (gratuita)

### Instalação

1. **Clone o projeto**
```bash
git clone <repo-url>
cd pezzo
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o Firebase** (IMPORTANTE)
   - Siga o guia completo em [`FIREBASE_SETUP.md`](./FIREBASE_SETUP.md)
   - Atualize as credenciais em `src/firebase/config.ts`

4. **Execute o projeto**
```bash
npm run dev
```

5. **Abra no navegador**
   - Acesse `http://localhost:5173`
   - Comece a registrar seus pensamentos! 🎉

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── Header/         # Cabeçalho com navegação
│   ├── PostCard/       # Card individual de post
│   ├── PostForm/       # Formulário de criação/edição
│   ├── PostList/       # Lista de posts
│   ├── ConnectionStatus/ # Status de conectividade
│   └── DataManager/    # Gerenciador de backup/restore
├── firebase/           # Configuração e serviços Firebase
├── hooks/              # Hooks customizados
├── types/              # Definições TypeScript
└── App.tsx            # Componente principal
```

## 🎯 Como Usar

### Criando um Post
1. Clique no botão "Novo Pensamento" (🚀)
2. Adicione um título e conteúdo
3. Escolha seu estado de humor
4. Adicione tags (opcional)
5. Publique!

### Organizando Posts
- **Tags**: Use tags para categorizar (#trabalho, #vida, #ideias)
- **Humor**: Cada post pode ter um estado de espírito
- **Data**: Posts são organizados cronologicamente

### Sincronização
- **Online**: Mudanças são sincronizadas em tempo real
- **Offline**: Posts são salvos localmente e sincronizados quando conectar
- **Multi-dispositivo**: Acesse de qualquer lugar com a mesma conta

### Backup & Restore
1. Clique no ícone de configurações (⚙️)
2. Use "Exportar Dados" para backup
3. Use "Importar Dados" para restaurar

## 🔧 Desenvolvimento

### Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Linting com ESLint
```

### Estrutura de Dados

```typescript
interface Post {
  id: string;
  title: string;
  content: string;
  date: Date;
  tags?: string[];
  mood?: 'positive' | 'neutral' | 'contemplative' | 'ambitious';
}
```

### Customização

#### Cores e Tema
Edite as variáveis CSS em `src/index.css`:

```css
:root {
  --bg-primary: #000000;      /* Fundo principal */
  --text-accent: #0ea5e9;     /* Cor de destaque */
  --gradient-primary: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
}
```

#### Fontes
O projeto usa Google Fonts:
- **Orbitron**: Para títulos e elementos de destaque
- **Inter**: Para texto corpo e interface

## 🔒 Segurança

### Regras do Firestore
Para produção, configure regras de segurança apropriadas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read: if true;  // Público para leitura
      allow write: if request.auth != null;  // Apenas usuários autenticados
    }
  }
}
```

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npm run build
# Deploy na Vercel via GUI ou CLI
```

### Netlify
```bash
npm run build
# Arraste a pasta `dist` para o Netlify
```

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 🤝 Contribuindo

1. Faça fork do projeto
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit suas mudanças: `git commit -m 'Add nova feature'`
4. Push para a branch: `git push origin feature/nova-feature`
5. Abra um Pull Request

## 📝 Roadmap

- [ ] 🔐 Autenticação com Google/GitHub
- [ ] 👤 Perfis de usuário
- [ ] 🔍 Busca e filtros avançados
- [ ] 📊 Analytics de humor
- [ ] 🌙 Modo claro/escuro
- [ ] 📱 Progressive Web App (PWA)
- [ ] 🎨 Temas personalizáveis
- [ ] 💬 Comentários e interações
- [ ] 📂 Categorias de posts
- [ ] 🔗 Compartilhamento social

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙏 Agradecimentos

- **SpaceX**: Pela inspiração de design futurista
- **Firebase**: Pela infraestrutura de backend gratuita
- **React Team**: Pelo excelente framework
- **Vite**: Pela ferramenta de build super rápida

---

**Feito com ❤️ e inspiração espacial** 🚀✨