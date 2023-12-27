import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';


@Injectable()
export class FirebaseService {
    private readonly firebaseAdmin: admin.app.App;
    // Will add other Firebase services as needed (e.g., Firestore, Realtime Database, etc.)
    
    constructor() {
        const serviceAccount = require(path.resolve(__dirname, '..','..','config','firebase-service-account.json'));
        if (!admin.apps.length) {
            this.firebaseAdmin = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                // Add any other Firebase config options if needed
            });
        }
    }

    getAdminInstance(): admin.app.App {
        return this.firebaseAdmin;
    }

    get auth() {
        return this.firebaseAdmin.auth();
    }
}