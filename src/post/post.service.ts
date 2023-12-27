import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostDocument } from './entities/post.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectModel('Post') private postModel: PaginateModel<PostDocument>,
    private readonly httpService: HttpService,
  ) {}

  private MUX_TOKEN_ID = process.env.MUX_TOKEN_ID;
  private MUX_SECRET_KEY = process.env.MUX_SECRET_KEY;

  private async uploadToMux(url: string) {
    const { data } = await this.httpService
      .post(
        'https://api.mux.com/video/v1/assets',
        {
          input: [
            {
              url,
            },
          ],
          playback_policy: ['public'],
        },
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${this.MUX_TOKEN_ID}:${this.MUX_SECRET_KEY}`,
            ).toString('base64')}`,
          },
        },
      )
      .toPromise();
    return {
      muxPlaybackId: data?.data?.playback_ids[0]?.id,
      muxAssetId: data?.data?.id,
    };
  }

  async create(userId: string, createPostDto: CreatePostDto) {
    const { muxPlaybackId, muxAssetId } = await this.uploadToMux(
      createPostDto.url,
    );
    const created = await this.postModel.create({
      ...createPostDto,
      user: userId,
      muxPlaybackId,
      muxAssetId,
      randomPoint: [Math.random(), Math.random()],
    });

    return this.postModel.findById(created._id).populate(['user', 'topic']);
  }

  findAll() {
    return this.postModel.find();
  }

  async childUserHomeFeed(
    followings: User[],
    page: number,
    limit: number,
    randomizer: string,
  ) {
    const randomPoint = randomizer
      ? Buffer.from(randomizer, 'base64').toString('ascii').split(',')
      : [Math.random(), Math.random()];
    const filterOptions = {
      randomPoint: { $near: randomPoint },
      user: {
        $in: followings,
      },
    };

    const count = await this.postModel
      .find({
        ...filterOptions,
      })
      .count();

    const results = await this.postModel
      .find({
        ...filterOptions,
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate(['user', 'topic'])
      .select({ randomPoint: 0, __v: 0 });

    return {
      docs: results,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      hasNextPage: count > page * limit,
      totalDocs: count,
      randomizer: Buffer.from(randomPoint.join(',')).toString('base64'),
    };
  }

  async getUserVideos(userId: string, page: number, limit: number) {
    const filterOptions = {
      user: userId,
    };

    const count = await this.postModel
      .find({
        ...filterOptions,
      })
      .count();

    const results = await this.postModel
      .find({
        ...filterOptions,
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate(['user', 'topic'])
      .select({ randomPoint: 0, __v: 0 });

    return {
      docs: results,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      hasNextPage: count > page * limit,
      totalDocs: count,
    };
  }

  async getTopicVideos(
    topicId: string,
    page: number,
    limit: number,
    randomizer: string,
  ) {
    const randomPoint = randomizer
      ? Buffer.from(randomizer, 'base64').toString('ascii').split(',')
      : [Math.random(), Math.random()];

    const filterOptions = {
      topic: topicId,
      randomPoint: { $near: randomPoint },
    };

    const count = await this.postModel.find({ ...filterOptions }).count();
    const results = await this.postModel
      .find({
        ...filterOptions,
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate(['user', 'topic'])
      .select({ randomPoint: 0, __v: 0 });

    return {
      docs: results,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      hasNextPage: count > page * limit,
      totalDocs: count,
      randomizer: Buffer.from(randomPoint.join(',')).toString('base64'),
    };
  }

  async searchTopicVideos(
    topicId: string,
    page: number,
    limit: number,
    query: string,
  ) {
    const filterOptions = {
      topic: topicId,
      ...(query && { $text: { $search: query } }),
    };

    const count = await this.postModel.find({ ...filterOptions }).count();
    const results = await this.postModel
      .find({
        ...filterOptions,
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate(['user', 'topic'])
      .select({ randomPoint: 0, __v: 0 });

    return {
      docs: results,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      hasNextPage: count > page * limit,
      totalDocs: count,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
