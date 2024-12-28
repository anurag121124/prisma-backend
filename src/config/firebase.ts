import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

// Load service account credentials
const serviceAccountPath = path.join(__dirname, '../../assets/service/backendcab-firebase-adminsdk-tqyn7-1f04093be3.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Export the admin instance for use in other parts of your app
export default admin;
