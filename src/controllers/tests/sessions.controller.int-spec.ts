import { Request, Response } from 'express';
import { database } from "../../database";
import { PrismaService } from "../../database/prisma/prisma.service";
import { ResponseFake } from './fakes/response.fake';
import { SessionsController } from '../sessions.controller';
import { sessionsControllerFactory } from '../factories/make-sessions.controller.factory';
import bcrypt from 'bcrypt';
import { NotFoundError } from '../../errors/not-found.error';
import { UnauthorizedError } from '../../errors/unauthorized.ero';

let prismaService: PrismaService;
let sessionsController: SessionsController;
let response: Response;

describe('SessionsController [int]', () => {
  beforeAll(async () => {
    await database.providers.prisma.connect();
    prismaService = database.providers.prisma;
  });

  beforeEach(() => {
    sessionsController = sessionsControllerFactory.make();
    response = new ResponseFake() as unknown as Response;
  });

  afterEach(async () => {
    await prismaService.reset();
  });

  afterAll(async () => {
    await prismaService.disconnect();
  });

  it('should be defined', () => {
    expect(sessionsController).toBeDefined();
  });

  describe('create', () => {
    it('should be able to create a session', async () => {
      const request = {
        body: {
          username: 'name',
          password: '123',
        }
      } as Request;

      const password = await bcrypt.hash(
        request.body.password,
        10
      );

      await prismaService.users.create({
        data: {
          username: 'name',
          password: password,
          id: 'id',
        }
      })

      await sessionsController.create(request, response);

      const token = response['jsonResult'].token;
      const user = response['jsonResult'].user;

      expect(user).toBeDefined();
      expect(token).toBeDefined();
    });

    it('should not be able to create a session with a not existent user', async () => {
      const request = {
        body: {
          username: 'name',
          password: '123',
        }
      } as Request;

      await expect(
        sessionsController.create(request, response)
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it('should not be able to create a session if password is not matching', async () => {
      const request = {
        body: {
          username: 'name',
          password: '123',
        }
      } as Request;

      await prismaService.users.create({
        data: {
          username: 'name',
          password: 'incorrect password',
          id: 'id',
        }
      })

      await expect(
        sessionsController.create(request, response)
      ).rejects.toBeInstanceOf(UnauthorizedError);
    });
  });
});


