import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { FollowingService } from '../following/following.service';
import { CreateChildUserDto } from './dto/create-child-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateChildUserDto } from './dto/update-child-user.dto';
import { UserDocument } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: PaginateModel<UserDocument>,
    @Inject(forwardRef(() => FollowingService))
    private readonly followingService: FollowingService,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }

  async createChildUser(parentId: string, createUserDto: CreateChildUserDto) {
    const allSystemUsersMatchingGrade = await this.userModel
      .find({ grade: createUserDto.grade, type: 'system' })
      .limit(7);
    const createdUser = await this.userModel.create({
      ...createUserDto,
      type: 'child',
      parentId,
    });
    await this.followingService.addFollowee(
      createdUser._id,
      allSystemUsersMatchingGrade.map(({ _id }) => _id),
    );
    return createdUser;
  }

  getChildUser(parentUserId: string, childUserId: string) {
    return this.userModel
      .findOne({ _id: childUserId, parentId: parentUserId })
      .populate('topic');
  }

  findAll() {
    return this.userModel.find();
  }

  async findAllSystemUsers(page: number, limit: number) {
    const filterOptions = {
      type: 'system',
    };
    const count = await this.userModel
      .find({
        ...filterOptions,
      })
      .count();

    const results = await this.userModel
      .find({ type: 'system' })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate(['topic'])
      .select({ __v: 0 });
    return {
      docs: results,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      hasNextPage: count > page * limit,
      totalDocs: count,
    };
  }

  findAllChildUsers(parentId: string) {
    return this.userModel.find({ parentId }).populate('topic');
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateChildUserDto: UpdateChildUserDto) {
    return `This action updates a #${id} user`;
  }

  updateChildUser(
    parentUserId: string,
    childUserId: string,
    updateChildUserDto: UpdateChildUserDto,
  ) {
    const { gemsToken, ...rest } = updateChildUserDto;
    return this.userModel.updateOne(
      { _id: childUserId, parentId: parentUserId },
      { ...rest, ...(gemsToken && { $inc: { gemsToken } }) },
    );
  }

  updateUserFollowerCount(userId: string, followers: number) {
    return this.userModel.updateOne({ _id: userId }, { $inc: { followers } });
  }

  updateUserFollowingCount(userId: string, following: number) {
    return this.userModel.updateOne({ _id: userId }, { $inc: { following } });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
