import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

import { serverEnvs } from '@/env/server';

export const client = new MongoClient(serverEnvs.MONGODB_URI);

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      // check if already connected
      return Promise.resolve(true);
    }

    await mongoose.connect(serverEnvs.MONGODB_URI);
    return Promise.resolve(true);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return Promise.reject(error);
  }
};
