import { NextRequest, NextResponse } from 'next/server';
import { TelegramBot } from '@/lib/telegram-bot';

export async function POST(request: NextRequest) {
  try {
    const { webhookUrl } = await request.json();
    
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      return NextResponse.json(
        { error: 'TELEGRAM_BOT_TOKEN not configured in environment variables' },
        { status: 400 }
      );
    }

    if (!webhookUrl) {
      return NextResponse.json(
        { error: 'webhookUrl is required' },
        { status: 400 }
      );
    }

    const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
    
    // Set the webhook
    const result = await bot.setWebhook(webhookUrl);
    
    if (result.ok) {
      return NextResponse.json({
        success: true,
        message: 'Webhook set successfully',
        webhookUrl,
        result
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to set webhook', details: result },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: 'Failed to setup webhook' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      return NextResponse.json({
        configured: false,
        error: 'TELEGRAM_BOT_TOKEN not configured'
      });
    }

    const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
    const webhookInfo = await bot.getWebhookInfo();
    
    return NextResponse.json({
      configured: true,
      webhook: webhookInfo.result
    });
  } catch (error) {
    return NextResponse.json({
      configured: false,
      error: 'Failed to get webhook info'
    });
  }
}