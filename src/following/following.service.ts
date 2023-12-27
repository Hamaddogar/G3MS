import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { UserService } from '../user/user.service';
import { FollowingDocument } from './entities/following.entity';

@Injectable()
export class FollowingService {
  constructor(
    @InjectModel('Following')
    private followingModel: PaginateModel<FollowingDocument>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}
  async addFollowee(follower: string, followees: string[]): Promise<number> {
    const inserted = await this.followingModel.insertMany([
      ...followees.map((followee) => {
        return { follower, followee };
      }),
    ]);
    await this.userService.updateUserFollowingCount(follower, inserted.length);
    for (let followee of followees) {
      await this.userService.updateUserFollowerCount(followee, inserted.length);
    }
    return inserted.length;
  }

  async removeFollowee(follower: string, followee: string): Promise<number> {
    const deleted = await this.followingModel.deleteOne({
      follower,
      followee,
    });
    await this.userService.updateUserFollowingCount(follower, -1);
    await this.userService.updateUserFollowerCount(followee, -1);
    return deleted.deletedCount;
  }

  findAllFollowees(follower: string) {
    return this.followingModel.find({ follower });
  }

  countAllFollowee(follower: string) {
    return this.followingModel.find({ follower }).count();
  }
}
