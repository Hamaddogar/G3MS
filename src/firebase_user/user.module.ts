import { Module } from '@nestjs/common';
import { FirebaseUserController } from './user.controller';
import { FirebaseModule } from '../firebase/firebase.module';
import { FirebaseUserService } from './user.service';
import { FirebaseService } from '../firebase/firebase.service'; // Import the FirebaseService

@Module({
  imports: [FirebaseModule],
  controllers: [FirebaseUserController],
  providers: [FirebaseUserService, FirebaseService] // Provide FirebaseService here
})
export class FirebaseUserModule {}