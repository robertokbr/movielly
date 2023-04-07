import { DBConnection } from "../database";
import jwt from 'jsonwebtoken';
import { NotFoundError } from "../errors/not-found.error";
import { UnauthorizedError } from "../errors/unauthorized.ero";
import { bcrypt } from "../utils/bcrypt";

export class CreateSessionUsecase {
  private dbConnection: DBConnection;

  constructor(
    dbConnection: DBConnection,
  ) {
    this.dbConnection = dbConnection;
  }

  public async execute(username: string, password: string) {
    const user = await this.dbConnection.users.findOne(username);

    if (!user) {
      throw new NotFoundError('User not found!');
    }

    const isPasswordMatching = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isPasswordMatching) {
      throw new UnauthorizedError('Username or password is not matching');
    }

    const token = jwt.sign(
      { username: user.username, id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
    );

    delete user.password;

    return {
      token,
      user,
    };
  }
}
