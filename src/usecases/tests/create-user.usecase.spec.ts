import { NotFoundError } from '../../errors/not-found.error';
import { User } from '../../models/user.model';
import { CreateUserUsecase } from '../create-user.usecase';

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
    const createUserUsecase = new CreateUserUsecase(mockDBConnection);
    const user = await createUserUsecase.execute({
      username: 'claudinho',
      password: 'senha123',
    });

    expect((user as User).username).toBe('claudinho');
  });

  it("should not be able to create an user if there is already a user with same username", async () => {
    mockDBConnection.users.findOne = (username: string) => {
      return {
        username,
      }
    };

    const createUserUsecase = new CreateUserUsecase(mockDBConnection);

    await expect(
      createUserUsecase.execute({
        username: 'claudinho',
        password: 'senha123',
      }),
    ).rejects.toBeInstanceOf(NotFoundError)
  });
})

