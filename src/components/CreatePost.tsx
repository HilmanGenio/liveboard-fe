import { useState } from 'react';
import { Post } from '../types';
import { postsAPI } from '../services/api';

interface CreatePostProps {
  onPostCreated: (post: Post) => void;
}

const CreatePost = ({ onPostCreated: _onPostCreated }: CreatePostProps) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await postsAPI.createPost(content.trim());
      console.log('Post created successfully:', response.data.data);
      
      // Don't call onPostCreated here - let Socket.IO handle it
      // This prevents duplicate posts
      setContent('');
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            rows={3}
            maxLength={1000}
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {content.length}/1000
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
