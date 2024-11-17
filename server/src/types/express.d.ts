import { User } from "passport"; // Adjust if your User type is different

declare global {
  namespace Express {
    interface User {
      // Define the properties for the user object here
      id: string;
      name: string;
      email: string;
      image: string;
      // Add other properties you use
    }

    interface Request {
      user?: User;
      file?: {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        destination: string;
        filename: string; // The property multer adds to the file object
        path: string;
        buffer: Buffer;
      };
      logout(): void;
      isAuthenticated: () => boolean;
    }
  }
}

export {};
