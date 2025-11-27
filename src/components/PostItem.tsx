import { Post } from '../types';

interface PostItemProps {
  post: Post;
  onLike: (postId: number) => void;
  currentUserId?: number;
}

const PostItem = ({ post, onLike, currentUserId }: PostItemProps) => {
  const isLikedByCurrentUser = post.likes.some(like => like.user.id === currentUserId);
  const timeAgo = new Date(post.createdAt).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleLikeClick = () => {
    onLike(post.id);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      {/* Author Info */}
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
          {post.author.name.charAt(0).toUpperCase()}
        </div>
        <div className="ml-3">
          <div className="font-semibold text-gray-900">{post.author.name}</div>
          <div className="text-sm text-gray-500">{timeAgo}</div>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-6">
        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{post.content}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          onClick={handleLikeClick}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            isLikedByCurrentUser
              ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <span className="text-lg">
            {isLikedByCurrentUser ? '❤️' : '🤍'}
          </span>
          <span className="font-medium">
            {post._count.likes} {post._count.likes === 1 ? 'Like' : 'Likes'}
          </span>
        </button>

        {/* Show who liked (if any) */}
        {post.likes.length > 0 && (
          <div className="text-sm text-gray-500">
            <span className="font-medium">Liked by </span>
            {post.likes.slice(0, 3).map((like, index) => (
              <span key={like.id}>
                {index > 0 && ', '}
                <span className="font-medium">{like.user.name}</span>
              </span>
            ))}
            {post.likes.length > 3 && (
              <span> and {post.likes.length - 3} others</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostItem;
