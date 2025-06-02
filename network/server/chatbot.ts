import { fetchData } from '../helpers/fetch-data';
import { Message } from '@/models/message';

export async function getConversationHistory(
  params: string
): Promise<Message[]> {
  const response = await fetchData(
    `/v1/chatbot/conversation/history${params}`,
    {
      method: 'GET',
    }
  );
  return await response.json();
}
