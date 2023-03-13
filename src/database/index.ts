import { Review } from "../models/review.model";
import { User } from "../models/user.model";

export class Database {
  private static users: User[] = [];
  private static reviews: Review[] = [];
  
  public static async connect() {
    return {
      users: {
        create: (user) => {
          this.users.push(user);
        },
        findOne: (user) => {
          return this.users.find((u) => u.username === user.username);
        },
        list: () => {
          return this.users;
        }
      }
    };
  }
}