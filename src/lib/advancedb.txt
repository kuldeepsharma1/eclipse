import mongoose from "mongoose";

interface MongoDBConfig {
  uri: string;
  options?: mongoose.ConnectOptions;
}

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      console.info('Already connected to MongoDB');
      return;
    }

    const config: MongoDBConfig = {
      uri: process.env.MONGO_URI!,
      options: {
        retryWrites: true,
        w: 'majority',
        maxPoolSize: 10,
      },
    };

    try {
      if (!config.uri) {
        throw new Error('MongoDB URI is not defined in environment variables');
      }

      await mongoose.connect(config.uri, config.options);
      this.isConnected = true;
      console.info('Successfully connected to MongoDB');
    } catch (error) {
      this.isConnected = false;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error(`MongoDB connection error: ${errorMessage}`);
      throw new Error('Failed to establish MongoDB connection');
    }

    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error);
      this.isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
      this.isConnected = false;
    });
  }
}

export const connectDB = async (): Promise<void> => {
  await DatabaseConnection.getInstance().connect();
};

export default connectDB;
