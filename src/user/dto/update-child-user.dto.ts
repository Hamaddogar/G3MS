import { PartialType } from '@nestjs/mapped-types';
import { IsNumber } from 'class-validator';
import { CreateChildUserDto } from './create-child-user.dto';

export class UpdateChildUserDto extends PartialType(CreateChildUserDto) {
  @IsNumber()
  lastQuizTime: number;

  @IsNumber()
  gemsToken: number;
}
