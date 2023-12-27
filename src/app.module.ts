import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { TopicModule } from './topic/topic.module';
import { PostModule } from './post/post.module';
import { FollowingModule } from './following/following.module';
import { FirebaseUserModule } from './firebase_user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UserModule,
    TopicModule,
    PostModule,
    FollowingModule,
    FirebaseUserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
