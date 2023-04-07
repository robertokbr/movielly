import { Request, Response } from 'express';
import { DBConnection } from '../database';
import { CreateUserUsecaseExecute } from '../usecases/create-user.usecase';
export class UsersController {
  constructor(private readonly dbconnection: DBConnection) {}

  public create = async (request: Request, response: Response): Promise<Response> => {
    const {
      username,
      password,
    } = request.body;

    await CreateUserUsecaseExecute(username, password, this.dbconnection);

    return response.status(201).json({
      message: 'User created successfully',
      statusCode: 201,
    });
  }

  public list = async (_: Request, response: Response): Promise<Response> => {
    const users = await this.dbconnection.users.list();

    const serializedUsers = users.map(user => {
      const {
        id,
        username
      } = user;

      return { id, username };
    })

    return response.status(200).json(serializedUsers);
  }
}
