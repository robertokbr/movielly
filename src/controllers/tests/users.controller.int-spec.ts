/**
 * describe
 * beforeAll - uma vez antes de tudo ->  ligar meu setup
 * beforeEach - limpar nossa sujeira
 * it
 * afterEach - limpar nossa sujeira
 * afterAll - desligar meu setup
 */
import { Request, Response } from 'express';
import { database } from "../../database";
import { PrismaService } from "../../database/prisma/prisma.service";
import { usersControllerFactory } from "../factories/make-users.controller.factory";
import { UsersController } from "../users.controller";
import { ResponseFake } from './fakes/response.fake';
import { ConflictError } from '../../errors/conflict.error';

let prismaService: PrismaService;
let usersController: UsersController;
let response: Response;

describe('UsersController [int]', () => {
  beforeAll(async () => {
    await database.providers.prisma.connect();
    prismaService = database.providers.prisma;
  });

  beforeEach(() => {
    usersController = usersControllerFactory.make();
    response = new ResponseFake() as unknown as Response;
  });

  afterEach(async () => {
    await prismaService.reset();
  });

  afterAll(async () => {
    await prismaService.disconnect();
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('create', () => {
    it('should create an user', async () => {
      // arrange
      const request = {
        body: {
          username: 'name',
          password: 'password',
        }
      } as Request;

      // act
      await usersController.create(request, response);

      // assert
      const user = await prismaService.users.findUnique({
        where: {
          username: 'name',
        }
      });

      expect(user).toBeDefined();
    });


    it('should not be able to create an user that already exists', async () => {
      // arrange
      const request = {
        body: {
          username: 'name',
          password: 'password',
        }
      } as Request;

      // act
      await usersController.create(request, response);

      await expect(
        usersController.create(request, response),
      ).rejects.toBeInstanceOf(ConflictError);
    });
  });

  describe('list', () => {
    it('should be able to return users', async () => {
      await prismaService.users.create({
        data: {
          username: 'name',
          password: 'password',
          id: 'id',
        }
      });

      await usersController.list({} as any, response);

      const userId = response['jsonResult'][0].id;

      expect(userId).toBeDefined();
    });
  });
});


