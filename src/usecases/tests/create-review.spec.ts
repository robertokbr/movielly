import { ConflictError } from '../../errors/conflict.error';
import { NotFoundError } from '../../errors/not-found.error';
import { Review } from '../../models/review.model';
import { CreateReviewUsecase } from '../create-review.usecase';

const duplicatedMovieTitle = 'duplicate movie title';

async function findByIdNull(_: string) {
  return null;
};

async function findByIdUser(username: string) {
  return {
    username,
    password: 'password',
  };
}

async function createReview(_: Review) {
  return null;
}

async function listDuplicatedReview(_: { userId: string }) {
  return [{ movie: duplicatedMovieTitle }];
}

async function listNull(data: { userId: string }) {
  return [];
}

const users = {
  findById: findByIdUser,
}

const reviews = {
  create: createReview,
  list: listNull
};

const mockDBConnection = {
  users,
  reviews
} as any;

describe("CreateReviewUsecase", () => {
  beforeEach(() => {
    mockDBConnection.users.findById = findByIdUser;
    mockDBConnection.reviews.list = listNull;
  });

  it("should be able to create a review", async () => {
    mockDBConnection.users.findById = findByIdUser;
    const createReviewUsecase = new CreateReviewUsecase(mockDBConnection);
    const createReviewParams = {
      comment: 'show',
      imageUrl: 'https://images/fotolegal.jpeg',
      movie: 'filme da hora',
      rating: 5,
      userId: 'id',
    };

    const review = await createReviewUsecase.execute(createReviewParams);

    expect(review.comment).toBe(createReviewParams.comment)
    expect(review.imageUrl).toBe(createReviewParams.imageUrl)
  });

  it("should not be able to create a review if the user not exists", async () => {
    mockDBConnection.users.findById = findByIdNull;
    const createReviewUsecase = new CreateReviewUsecase(mockDBConnection);
    const createReviewParams = {
      comment: 'show',
      imageUrl: 'https://images/fotolegal.jpeg',
      movie: 'filme da hora',
      rating: 5,
      userId: 'id',
    };

    await expect(createReviewUsecase.execute(createReviewParams)).rejects.toBeInstanceOf(NotFoundError)
  });

  it("should not be able to create a duplicated review", async () => {
    mockDBConnection.users.findById = findByIdUser;
    mockDBConnection.reviews.list = listDuplicatedReview;
    const createReviewUsecase = new CreateReviewUsecase(mockDBConnection);

    const createReviewParams = {
      comment: 'show',
      imageUrl: 'https://images/fotolegal.jpeg',
      movie: duplicatedMovieTitle,
      rating: 5,
      userId: 'id',
    };

    await expect(createReviewUsecase.execute(createReviewParams)).rejects.toBeInstanceOf(ConflictError)
  });
});

