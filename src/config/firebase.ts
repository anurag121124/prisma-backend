import admin from 'firebase-admin';

const serviceAccountBase64 = process.env.FIREBASE_ADMIN_CREDENTIALS;
if (!serviceAccountBase64) {
  throw new Error('Firebase credentials are not set in the environment variables');
}

const serviceAccount = JSON.parse(
  Buffer.from(serviceAccountBase64, 'base64').toString('utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
