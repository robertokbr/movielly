import { DBConnection } from "../database";
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';
import { NotFoundError } from "../errors/not-found.error";

interface CreateUserUsecaseParams {
  username: string;
  password: string;
}

export class CreateUserUsecase {
  constructor(private dbconnection: DBConnection) {}

  public async execute({
    username,
    password,
  }: CreateUserUsecaseParams) {
    const userWithSameUsername = await this.dbconnection.users.findOne(username);

  if (userWithSameUsername) {
    throw new NotFoundError('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    password: hashedPassword,
  });

  await this.dbconnection.users.create(user);

  return user;
  }
}
