import { io, Socket } from 'socket.io-client';
import { Post } from '../types';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

class SocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    this.socket = io(SOCKET_URL, {
      auth: {
        token
      }
    });

    this.socket.on('connect', () => {
      console.log('🔌 Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 Disconnected from server');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onNewPost(callback: (post: Post) => void) {
    if (this.socket) {
      this.socket.on('new_post', callback);
    }
  }

  onLikeUpdate(callback: (data: { postId: number; likeCount: number; isLiked: boolean }) => void) {
    if (this.socket) {
      this.socket.on('like_update', callback);
    }
  }

  offNewPost() {
    if (this.socket) {
      this.socket.off('new_post');
    }
  }

  offLikeUpdate() {
    if (this.socket) {
      this.socket.off('like_update');
    }
  }
}

export const socketService = new SocketService();
