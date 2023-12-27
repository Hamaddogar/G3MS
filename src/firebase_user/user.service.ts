import { Injectable ,UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as admin from 'firebase-admin';
import * as bcrypt from 'bcrypt';
import * as QRCode from 'qrcode';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

@Injectable()
export class FirebaseUserService {

    constructor(private readonly firebaseService: FirebaseService) {}
    
    async createUser(userDto: CreateUserDto): Promise<any> {
        try {
            const firebaseAdmin = this.firebaseService.getAdminInstance();
            const { email, password , role } = userDto;
            const {uid} = await firebaseAdmin.auth().createUser({
                email,
                password
            });
            // await firebaseAdmin.auth().setCustomUserClaims(uid, {role});
            const customToken = await firebaseAdmin.auth().createCustomToken(uid);
            return [
                { message: 'User Created Successfully', token: customToken , code:200 }
            ];
        } 
        catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }

    async signInWithEmailAndPassword(userDto : CreateUserDto): Promise<any> {
        const firebaseAdmin = this.firebaseService.getAdminInstance();
        const { email, password , role } = userDto;
        const user = await admin.auth().getUserByEmail(email);
    
        // Extract the hashed password from user record (this is just a placeholder; Firebase doesn't expose raw passwords)
        // const hashedPasswordFromFirebase = user.passwordHash;
        // // verifyIdToken
        // const isPasswordValid = await bcrypt.compare(password, hashedPasswordFromFirebase);
        // if(!user){
        //     throw new Error('Invalid Email');
        // }
        // if (!isPasswordValid) {
        //     throw new Error('Invalid password');
        // }

        // Generate a custom token for the user
        const customToken = await admin.auth().createCustomToken(user.uid);

        // Return the custom token or any other required info
        return [
            { message: 'User logined Successfully', token: customToken , code:200 }
        ];
    }
    

    async getUserByEmail(email: string): Promise<admin.auth.UserRecord> {
        const firebaseAdmin = this.firebaseService.getAdminInstance();
        return await admin.auth().getUserByEmail(email);
    }

    async generateQrCode(userDto : CreateUserDto): Promise<Buffer> {
        try {
            const { email, password , role } = userDto;
            const user = await admin.auth().getUserByEmail(email);
            // const customToken = await admin.auth().createCustomToken(user.uid);
            const qrCodeBuffer = await QRCode.toBuffer(user.uid);
            return qrCodeBuffer;
        } catch (error) {
            throw new Error('Failed to generate QR code');
        }
    }


}
