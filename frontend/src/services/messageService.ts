import api from './api';

export interface Message {
  _id: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
  } | string;
  recipient: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface Conversation {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    role: string;
    image?: string;
  };
  lastMessage: {
    content: string;
    createdAt: string;
    read: boolean;
    sender: string;
  };
}

export const sendMessage = async (recipientId: string, content: string): Promise<Message> => {
  const response = await api.post<Message>('/messages', { recipientId, content });
  return response.data;
};

export const getConversations = async (): Promise<Conversation[]> => {
  const response = await api.get<Conversation[]>('/messages/conversations');
  return response.data;
};

export const getMessages = async (otherUserId: string): Promise<Message[]> => {
  const response = await api.get<Message[]>(`/messages/${otherUserId}`);
  return response.data;
};

export const markAsRead = async (senderId: string): Promise<void> => {
  await api.put(`/messages/read/${senderId}`);
};

export const getUnreadCount = async (): Promise<number> => {
  const response = await api.get<{ count: number }>('/messages/unread');
  return response.data.count;
};
