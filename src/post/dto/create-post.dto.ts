import { IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  url: string;

  @IsString()
  topic: string;
}
