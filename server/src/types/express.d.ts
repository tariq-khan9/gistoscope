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
      logout(): void;
      isAuthenticated: () => boolean;
    }
  }
}

export {};
