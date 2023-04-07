import { DBConnection } from "../database";
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';
import { NotFoundError } from "../errors/not-found.error";

export async function CreateUserUsecaseExecute(username: string, password, dbconnection: DBConnection) {
  const userWithSameUsername = await dbconnection.users.findOne(username);

  if (userWithSameUsername) {
    throw new NotFoundError('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    password: hashedPassword,
  });

  await dbconnection.users.create(user);

  return user;
}
