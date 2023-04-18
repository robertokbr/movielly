import { Request, Response } from 'express';
import { database } from "../../database";
import { PrismaService } from "../../database/prisma/prisma.service";
import { ResponseFake } from './fakes/response.fake';
import { ReviewsController } from '../reviews.controller';
import { reviewsControllerFactory } from '../factories/make-reviews.controller.factory';
import { NotFoundError } from '../../errors/not-found.error';
import { ConflictError } from '../../errors/conflict.error';

let prismaService: PrismaService;
let reviewsController: ReviewsController;
let response: Response;

describe('SessionsController [int]', () => {
  beforeAll(async () => {
    await database.providers.prisma.connect();
    prismaService = database.providers.prisma;
  });

  beforeEach(() => {
    reviewsController = reviewsControllerFactory.make();
    response = new ResponseFake() as unknown as Response;
  });

  afterEach(async () => {
    await prismaService.reset();
  });

  afterAll(async () => {
    await prismaService.disconnect();
  });

  it('should be defined', () => {
    expect(reviewsController).toBeDefined();
  });

  describe('create', () => {
    it('should be able to create a review', async () => {
        const request = {
          body: {
            movie: 'movie',
            comment: 'comment',
            rating: 5,
            imageUrl: 'imageUrl',
          },
        } as Request;

        const user = await prismaService.users.create({
          data: {
            id: 'id',
            password: 'password',
            username: 'username',
          }
        });

        request['user'] = user;

        await reviewsController.create(request, response);

        const reviews = await prismaService.reviews.findMany();

        expect(reviews[0].id).toBeDefined();
    });

    it('should not be able to create a review with a invalid user', async () => {
      const request = {
        body: {
          movie: 'movie',
          comment: 'comment',
          rating: 5,
          imageUrl: 'imageUrl',
        },
      } as Request;

      request['user'] = {
        id: 'invalid id'
      };

      await expect(
        reviewsController.create(request, response)
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it('should not be able to create a duplicated review', async () => {
      const request = {
        body: {
          movie: 'movie',
          comment: 'comment',
          rating: 5,
          imageUrl: 'imageUrl',
        },
      } as Request;

      const user = await prismaService.users.create({
        data: {
          id: 'id',
          password: 'password',
          username: 'username',
        }
      });

      request['user'] = user;

      await reviewsController.create(request, response);

      await expect(
        reviewsController.create(request, response)
      ).rejects.toBeInstanceOf(ConflictError)
    });
  });

  describe('list', () => {
    it('should be able to list all reviews', async() => {
      const request = {
        body: {
          movie: 'movie',
          comment: 'comment',
          rating: 5,
          imageUrl: 'imageUrl',
        },
      } as Request;

      const user = await prismaService.users.create({
        data: {
          id: 'id',
          password: 'password',
          username: 'username',
        }
      });

      request['user'] = user;
      await reviewsController.create(request, response);
      await reviewsController.list(request, response);
      const reviews = response['jsonResult'];

      expect(reviews[0].id).toBeDefined();
      expect(reviews.length).toBe(1);
    });
  });
});


