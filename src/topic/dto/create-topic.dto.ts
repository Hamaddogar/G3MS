import { IsString } from 'class-validator';

export class CreateTopicDto {
  @IsString()
  public topic: string;
}
