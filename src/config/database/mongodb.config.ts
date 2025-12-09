import { MongooseModuleOptions } from '@nestjs/mongoose';

export const mongodbConfig = (): MongooseModuleOptions => ({
  uri: process.env.MONGO_URI,
  dbName: process.env.MONGO_DB_NAME,
});
