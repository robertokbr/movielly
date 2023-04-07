import { NotFoundError } from '../../errors/not-found.error';
import { User } from '../../models/user.model';
import { CreateUserUsecaseExecute } from '../create-user.usecase';

async function findOne(_: string) {
  return null;
}

async function create(_: User) {
  return null;
}

const users = {
  findOne,
  create
}

const mockDBConnection = {
  users,
} as any;

describe("UsersController", () => {
  it("deve ser capaz de criar um usuario", async () => {
    const user = await CreateUserUsecaseExecute('claudinho', 'senha123', mockDBConnection);

    expect((user as User).username).toBe('claudinho');
  });

  it("should not be able to create an user if there is already a user with same username", async () => {
    mockDBConnection.users.findOne = (username: string) => {
      return {
        username,
      }
    };

    await expect(
      CreateUserUsecaseExecute('claudinho', 'senha123', mockDBConnection)
    ).rejects.toBeInstanceOf(NotFoundError)
  });
})

