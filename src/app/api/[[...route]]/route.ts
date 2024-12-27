import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { cors } from 'hono/cors';

import { auth } from '@/lib/auth';
import { clientEnvs } from '@/env/client';
import { getModels } from '@/lib/models';
import { connectDB } from '@/services/db';

//export const runtime = 'edge';

const app = new Hono().basePath('/api');

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello World!',
  });
});

app.on(['POST', 'GET'], '/auth/**', (c) => {
  return auth.handler(c.req.raw);
});

app.use(
  '/api/auth/**', // or replace with "*" to enable cors for all routes
  cors({
    origin: clientEnvs.NEXT_PUBLIC_DOMAIN, // replace with your origin
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  })
);

app.get('/chat', async (c) => {
  try {
    await connectDB();
    const { Chat } = getModels();

    // Get all chats
    const chats = await Chat.find({}).lean();

    return c.json({ success: true, chats: chats });
  } catch (error) {
    console.error('Server error:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to fetch chats',
        details: error,
      },
      500
    );
  }
});

app.get('/chat/:chatId/get', async (c) => {
  try {
    await connectDB();
    const { Message } = getModels();

    const chatId = Number(c.req.param('chatId'));
    const messages = await Message.find({ chatId })
      .sort({ createdAt: 1 })
      .lean();

    return c.json({ success: true, messages });
  } catch (error) {
    console.error('Server error:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to fetch messages',
      },
      500
    );
  }
});

app.post('/chat/:chatId/send', async (c) => {
  try {
    await connectDB();
    const { Message } = getModels();

    const chatId = Number(c.req.param('chatId'));
    const { content } = await c.req.json();

    if (!content) {
      return c.json(
        {
          success: false,
          error: 'Content and user are required',
        },
        400
      );
    }

    const messageData = {
      _id: Date.now(),
      chatId: chatId,
      content,
      user: 'testuser',
      createdAt: new Date(),
    };
    console.log(new Date(), chatId);
    console.log('Attempting to save message with data:', messageData);
    const message = new Message(messageData);
    console.log('Created message instance:', message);

    try {
      await message.save();
      console.log('Message saved successfully:', message.toObject()); // Use toObject() to see all fields
    } catch (error) {
      console.error('Error details:', error);
      throw error;
    }

    return c.json({ success: true, message: message.toObject() });
  } catch (error) {
    console.error('Server error:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to send message',
        details: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});

export const GET = handle(app);
export const POST = handle(app);
