import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateFollowingDto } from './following/dto/create-following.dto';
import { FollowingService } from './following/following.service';
import { CreatePostDto } from './post/dto/create-post.dto';
import { PostService } from './post/post.service';
import { CreateChildUserDto } from './user/dto/create-child-user.dto';
import { UpdateChildUserDto } from './user/dto/update-child-user.dto';
import { UserService } from './user/user.service';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly postService: PostService,
    private readonly followingService: FollowingService,
  ) {}

  @Get('parent-users/:parentUserId/child-users')
  getListOfAllChildUsers(@Param('parentUserId') parentUserId: string) {
    return this.userService.findAllChildUsers(parentUserId);
  }

  @Get('parent-users/:parentUserId/child-users/:childUserId')
  getChildUser(
    @Param('parentUserId') parentUserId: string,
    @Param('childUserId') childUserId: string,
  ) {
    return this.userService.getChildUser(parentUserId, childUserId);
  }

  @Get('child-users/:childUserId/home-feed')
  async childUserHomeFeed(
    @Param('childUserId') childUserId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('randomizer') randomizer: string,
  ) {
    const followings = await this.followingService.findAllFollowees(
      childUserId,
    );
    return this.postService.childUserHomeFeed(
      followings.map(({ followee }) => followee),
      page,
      limit,
      randomizer,
    );
  }

  @Get('system-users')
  async findAllSystemUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.userService.findAllSystemUsers(page, limit);
  }

  @Get('users/:userId/videos')
  getUserVideos(
    @Param('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.postService.getUserVideos(userId, page, limit);
  }

  @Get('topics/:topicId/videos')
  getTopicVideos(
    @Param('topicId') topicId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('randomizer') randomizer: string,
  ) {
    return this.postService.getTopicVideos(topicId, page, limit, randomizer);
  }

  @Get('topics/:topicId/videos:search')
  searchTopicVideos(
    @Param('topicId') topicId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('query') query: string,
  ) {
    return this.postService.searchTopicVideos(topicId, page, limit, query);
  }

  @Post('users/:userId/videos')
  postVideo(
    @Param('userId') userId: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postService.create(userId, createPostDto);
  }

  @Post('parent-users/:parentUserId/child-users')
  createChildUser(
    @Body() createChildUserDto: CreateChildUserDto,
    @Param('parentUserId') parentUserId: string,
  ) {
    return this.userService.createChildUser(parentUserId, createChildUserDto);
  }

  @Post('follower/:followerId/followee/:followeeId')
  async addFollowee(
    @Param('followerId') followerId: string,
    @Param('followeeId') followeeId: string,
  ) {
    const added = await this.followingService.addFollowee(followerId, [
      followeeId,
    ]);
    return `${added} following${
      added > 1 ? 's have been' : ' has been'
    } added.`;
  }

  @Delete('follower/:followerId/followee/:followeeId')
  async removeFollowee(
    @Param('followerId') followerId: string,
    @Param('followeeId') followeeId: string,
  ) {
    const removed = await this.followingService.removeFollowee(
      followerId,
      followeeId,
    );
    return `${removed} following${
      removed > 1 ? 's have been' : ' has been'
    } removed.`;
  }

  @Patch('parent-users/:parentUserId/child-users/:childUserId')
  updateChildUser(
    @Body() updateChildUserDto: UpdateChildUserDto,
    @Param('parentUserId') parentUserId: string,
    @Param('childUserId') childUserId: string,
  ) {
    return this.userService.updateChildUser(
      parentUserId,
      childUserId,
      updateChildUserDto,
    );
  }
}
