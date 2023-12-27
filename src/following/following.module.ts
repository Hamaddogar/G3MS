import { forwardRef, Module } from '@nestjs/common';
import { FollowingService } from './following.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowingSchema } from './entities/following.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Following', schema: FollowingSchema }]),
    forwardRef(() => UserModule),
  ],
  providers: [FollowingService],
  exports: [FollowingService],
})
export class FollowingModule {}
