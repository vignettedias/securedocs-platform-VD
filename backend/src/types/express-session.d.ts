import "express-session";

declare module "express-session" {
  interface SessionData {
    state?: string;
    user?: {
      sub: string;
      email?: string;
      name?: string;
    };
  }
}