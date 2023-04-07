import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { DBConnection } from '../database';
import { CreateSessionUsecase } from '../usecases/create-session.usecase';

export class SessionsController {
  constructor(private readonly dbconnection: DBConnection) {}

  public create = async (request: Request, response: Response): Promise<Response> => {
    const {
      username,
      password
    } = request.body;

    const createSessionUsecase = new CreateSessionUsecase(
      this.dbconnection,
    );

    const res = await createSessionUsecase.execute(
      username,
      password
    );

    return response.status(201).json({
      token: res.token,
      user: res.user,
    });
  }
}
