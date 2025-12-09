import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { TodosModule } from './todos/todos.module';
import { MongooseModule } from '@nestjs/mongoose';
import { mongodbConfig } from './config/database/mongodb.config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TodosModule,
    MongooseModule.forRootAsync({
      useFactory: mongodbConfig,
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
