import { DBConnection } from "../database";
import { ConflictError } from "../errors/conflict.error";
import { NotFoundError } from "../errors/not-found.error";
import { Review } from "../models/review.model";

interface CreateReviewUsecaseParams {
  movie: string;
  comment: string;
  rating: number;
  userId: string;
  imageUrl: string;
}

export class CreateReviewUsecase {
  constructor(private dbConnection: DBConnection) {}

  public async execute({
    comment,
    imageUrl,
    movie,
    rating,
    userId
   }: CreateReviewUsecaseParams) {
    const user = await this.dbConnection.users.findById(
      userId,
    );

    if (!user) throw new NotFoundError('User not found for the provided id');

    const review = new Review({
      movie,
      comment,
      rating,
      userId,
      imageUrl,
    });

    const myReviews = await this.dbConnection.reviews.list({
      userId,
    });

    const sameMovieReview = myReviews.find(r => r.movie === review.movie);

      if (sameMovieReview) throw new ConflictError('You have already created a review to this movie');

    await this.dbConnection.reviews.create(review);

    return review;
  }
}
