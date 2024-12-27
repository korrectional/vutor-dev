import { Schema } from 'mongoose';

// Define interfaces
export interface IMessage {
  _id?: number; // Changed from string to number
  user: string;
  content: string;
  chatId: number;
  createdAt: Date; // Added createdAt
}

export interface IChat {
  _id?: string; // MongoDB ID
  participants: string[];
  messages: IMessage[];
}

export interface Message {
  chatId: number;
  _id: number;
  content: string;
  user: string;
  createdAt: Date;
}

export interface Chat {
  _id: number;
  participants: string[];
  messages: Message[];
}

export interface MessageActions {
  create: (chatId: number, content: string, user: string) => Message;
}

// Create schemas
export const MessageSchema = new Schema(
  {
    _id: { type: Number },
    chatId: { type: Number },
    content: { type: String },
    user: { type: String },
    createdAt: { type: Date },
  },
  {
    strict: true,
    versionKey: false,
    _id: false,
  }
);

// Add this after the schema definition
MessageSchema.set('toObject', {
  transform: function (doc, ret) {
    return {
      _id: ret._id,
      chatId: ret.chatId,
      content: ret.content,
      user: ret.user,
      createdAt: ret.createdAt,
    };
  },
});

export const ChatSchema = new Schema<IChat>(
  {
    _id: { type: String, required: true },
    participants: { type: [String], required: true },
  },
  { _id: true }
);

export const messageActions: MessageActions = {
  create: (chatId, content, user) => ({
    _id: Date.now(),
    chatId,
    content,
    user,
    createdAt: new Date(),
  }),
};
