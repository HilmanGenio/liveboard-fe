import { Post } from '../types';
import PostItem from './PostItem';

interface PostListProps {
  posts: Post[];
  onLike: (postId: number) => void;
  currentUserId?: number;
}

const PostList = ({ posts, onLike, currentUserId }: PostListProps) => {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No posts yet. Be the first to share something!</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          onLike={onLike}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
};

export default PostList;
