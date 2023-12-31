
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsString()
    @MinLength(4)
    role: string;
}

