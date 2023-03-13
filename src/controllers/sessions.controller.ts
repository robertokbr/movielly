import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export class SessionsController {
  private readonly dbconnection = 

  public async create(request: Request, response: Response): Promise<Response> {
    const {
      username,
      password
    } = request.body;


  }
}