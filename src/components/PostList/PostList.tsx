import type { FC } from 'react';
import PostCard from '../PostCard/PostCard';
import type { Post } from '../../types/Post';
import './PostList.css';

interface PostListProps {
  posts: Post[];
  onEditPost: (post: Post) => void;
  onDeletePost: (id: string) => void;
}

const PostList: FC<PostListProps> = ({ posts, onEditPost, onDeletePost }) => {
  if (posts.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-content">
          <div className="empty-icon animate-float">🚀</div>
          <h2 className="empty-title text-display">Pronto para decolar?</h2>
          <p className="empty-description">
            Comece sua jornada espacial compartilhando seu primeiro pensamento.
            <br />
            O universo está esperando suas ideias!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="post-list">
      <div className="posts-grid">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onEdit={onEditPost}
            onDelete={onDeletePost}
          />
        ))}
      </div>
      
      <div className="posts-footer">
        <p className="posts-count text-accent">
          {posts.length} {posts.length === 1 ? 'pensamento' : 'pensamentos'} em órbita
        </p>
      </div>
    </div>
  );
};

export default PostList;