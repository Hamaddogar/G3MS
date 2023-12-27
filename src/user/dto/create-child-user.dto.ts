import { IsDate, IsString } from 'class-validator';

export class CreateChildUserDto {
  @IsString()
  public username: string;

  @IsString()
  public fullname: string;

  @IsDate()
  public DOB: Date;

  @IsString()
  public grade: string;

  @IsString()
  public profileImage: string;
}
