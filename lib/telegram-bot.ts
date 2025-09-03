import axios from 'axios';

interface TelegramMessage {
  message_id: number;
  from: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
  };
  chat: {
    id: number;
    type: string;
  };
  date: number;
  text?: string;
  photo?: Array<{
    file_id: string;
    file_unique_id: string;
    width: number;
    height: number;
    file_size?: number;
  }>;
}

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}

class TelegramBot {
  private token: string;
  private baseUrl: string;

  constructor(token: string) {
    this.token = token;
    this.baseUrl = `https://api.telegram.org/bot${token}`;
  }

  async sendMessage(chatId: number, text: string) {
    try {
      const response = await axios.post(`${this.baseUrl}/sendMessage`, {
        chat_id: chatId,
        text,
        parse_mode: 'HTML'
      });
      return response.data;
    } catch (error) {
      console.error('Error sending Telegram message:', error);
      throw error;
    }
  }

  async getFile(fileId: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/getFile?file_id=${fileId}`);
      return response.data.result;
    } catch (error) {
      console.error('Error getting Telegram file:', error);
      throw error;
    }
  }

  async downloadFile(filePath: string): Promise<Buffer> {
    try {
      const url = `https://api.telegram.org/file/bot${this.token}/${filePath}`;
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      return Buffer.from(response.data);
    } catch (error) {
      console.error('Error downloading Telegram file:', error);
      throw error;
    }
  }

  async setWebhook(webhookUrl: string) {
    try {
      const response = await axios.post(`${this.baseUrl}/setWebhook`, {
        url: webhookUrl,
        allowed_updates: ['message']
      });
      return response.data;
    } catch (error) {
      console.error('Error setting webhook:', error);
      throw error;
    }
  }

  async deleteWebhook() {
    try {
      const response = await axios.post(`${this.baseUrl}/deleteWebhook`);
      return response.data;
    } catch (error) {
      console.error('Error deleting webhook:', error);
      throw error;
    }
  }

  async getWebhookInfo() {
    try {
      const response = await axios.get(`${this.baseUrl}/getWebhookInfo`);
      return response.data;
    } catch (error) {
      console.error('Error getting webhook info:', error);
      throw error;
    }
  }
}

export { TelegramBot, type TelegramUpdate, type TelegramMessage };