export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  bio?: string;
  media: Media[];
  language: string;
  followers: string[];
  following: string[];
  favorites: string[];
  stories: Story[];
  posts: Post[];
  createdAt: string;
  lastLogin: string;
}

export interface Media {
  id: string;
  url: string;
  type: 'image' | 'video';
  createdAt: number;
}

export interface Story {
  id: string;
  userId: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  createdAt: number;
  expiresAt: number;
  views: string[];
  likes: string[];
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  likes: string[];
  comments: Comment[];
  createdAt: number;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: number;
  likes: string[];
}