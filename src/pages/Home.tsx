import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Post } from '../types';
import { postsAPI } from '../services/api';
import { socketService } from '../services/socket';
import CreatePost from '../components/CreatePost';
import PostList from '../components/PostList';

const Home = () => {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPosts();
    setupSocketListeners();
    
    return () => {
      socketService.offNewPost();
      socketService.offLikeUpdate();
    };
  }, [user]);

  const loadPosts = async () => {
    try {
      setError('');
      const response = await postsAPI.getAllPosts();
      setPosts(response.data.data);
    } catch (error: any) {
      setError('Failed to load posts. Please refresh the page.');
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupSocketListeners = () => {
    // Listen for new posts
    socketService.onNewPost((newPost) => {
      setPosts(prev => {
        const exists = prev.some(post => post.id === newPost.id);
        return exists ? prev : [newPost, ...prev];
      });
    });

    // Listen for like updates
    socketService.onLikeUpdate((likeData) => {
      setPosts(prev => prev.map(post => {
        if (post.id === likeData.postId) {
          const updatedPost = { 
            ...post, 
            _count: { likes: likeData.likeCount }
          };
          
          // Update likes array
          if (likeData.isLiked) {
            const userAlreadyLiked = post.likes.some(like => like.user.id === likeData.userId);
            if (!userAlreadyLiked) {
              const likeUser = likeData.userId === user?.id 
                ? { id: user.id, name: user.name }
                : { id: likeData.userId, name: 'User' };
              
              updatedPost.likes = [...post.likes, {
                id: Date.now(),
                user: likeUser,
                createdAt: new Date().toISOString()
              }];
            }
          } else {
            updatedPost.likes = post.likes.filter(like => like.user.id !== likeData.userId);
          }
          
          return updatedPost;
        }
        return post;
      }));
    });
  };

  const handleLike = async (postId: number) => {
    try {
      await postsAPI.toggleLike(postId);
      // Real-time update handled by socket
    } catch (error) {
      console.error('Failed to toggle like:', error);
      // Could add toast notification here
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <div className="text-lg text-gray-600">Loading posts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LB</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">LiveBoard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-semibold text-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-gray-700 font-medium">Welcome, {user?.name}</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <CreatePost onPostCreated={() => {}} />
        
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
            <button 
              onClick={loadPosts}
              className="ml-2 underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}
        
        <PostList 
          posts={posts} 
          onLike={handleLike} 
          currentUserId={user?.id} 
        />
      </main>
    </div>
  );
};

export default Home;
