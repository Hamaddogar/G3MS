import { Controller, Post, Body ,Get ,Res } from '@nestjs/common';
import { FirebaseUserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('firebase-user/')
export class FirebaseUserController {

    constructor(private readonly usersService: FirebaseUserService ) {}

    @Post('create')
    async createUser(@Body() CreateUserDto:CreateUserDto): Promise<any> {
        return this.usersService.createUser(CreateUserDto);
    }

    @Post('login')
    async UserLogin(@Body() CreateUserDto:CreateUserDto): Promise<any> {
        return this.usersService.signInWithEmailAndPassword(CreateUserDto);
    }

    @Post('generate-qr')
    async generateQrCode(@Res() res , @Body() CreateUserDto:CreateUserDto): Promise<void> {
        // const uniqueToken = 'some_unique_token_or_user_identifier,some_unique_token_or_user_identifier,some_unique_token_or_user_identifier'; // Generate or fetch from database
        const qrCodeUrl = await this.usersService.generateQrCode(CreateUserDto);
        
        res.setHeader('Content-Type', 'image/png');
        res.send(qrCodeUrl);
    }

}
