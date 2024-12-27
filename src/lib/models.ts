import mongoose, { Model } from 'mongoose';
import { IMessage, IChat, MessageSchema, ChatSchema } from './types';

interface Models {
  Message: Model<IMessage>;
  Chat: Model<IChat>;
}

const models: Models = {} as Models;

export function getModels() {
  if (!models.Message) {
    if (mongoose.models.Message) {
      delete mongoose.models.Message;
    }
    models.Message = mongoose.model<IMessage>(
      'Message',
      MessageSchema,
      'messages'
    );
  }
  if (!models.Chat) {
    if (mongoose.models.Chat) {
      delete mongoose.models.Chat;
    }
    models.Chat = mongoose.model<IChat>('Chat', ChatSchema, 'chats');
  }
  return models;
}
