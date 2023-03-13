import { randomBytes } from 'crypto';

export class Review {
  id: string;

  rating: number;

  comment: string;

  userId: string;

  moveTitle: string;

  constructor(data: Omit<Review, 'id'>) {
    const id = randomBytes(16).toString('hex');
    Object.assign(this, { id: id, ...data });
  }
}