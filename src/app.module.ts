import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { TodosModule } from './modules/todos/todos.module';
import { MongooseModule } from '@nestjs/mongoose';
import { mongodbConfig } from './config/mongodb.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TodosModule,
    MongooseModule.forRootAsync({
      useFactory: mongodbConfig,
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
