import { ChatRequest, ChatResponse, isChatResponse } from '@/types/chat';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export class ChatService {
  static async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!isChatResponse(data)) {
      throw new Error('Invalid response format from backend');
    }

    return data;
  }

  static async getConversationHistory(conversationId: string): Promise<ChatResponse> {
    const response = await fetch(
      `${API_BASE_URL}/chat/history/${conversationId}`,
      { method: 'GET' }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch history`);
    }

    const data = await response.json();

    if (!isChatResponse(data)) {
      throw new Error('Invalid response format');
    }

    return data;
  }
}