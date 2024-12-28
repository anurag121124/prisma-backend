export interface User {
    firebaseId: string;
    email: string;
    fullName: string;  // Ensure it's required
    socketId: string;  // Ensure it's required
    password: string;
    mobile_number: string;
  }