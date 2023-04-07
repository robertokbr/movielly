import { NotFoundError } from "../../errors/not-found.error";
import { UnauthorizedError } from "../../errors/unauthorized.ero";
import { bcrypt } from "../../utils/bcrypt";
import { CreateSessionUsecase } from "../create-session.usecase";

async function findOneNull(_: string) {
  return null;
}

async function findOneUser(username: string) {
  return {
    username,
    password: 'password',
  }
};

const users = {
  findOne: findOneNull,
}

const mockDBConnection = {
  users,
} as any;

describe("CreateSessionUsecase", () => {
  it("should not be able to create a session if there is no user to the provided username", async () => {
    const username = 'not created';
    const password = 'some password';
    const createSessionUsecase = new CreateSessionUsecase(mockDBConnection);

    await expect(
      createSessionUsecase.execute(username, password),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("should not be able to create a session if username and password is not matching", async () => {
    mockDBConnection.users.findOne = findOneUser;
    const username = 'not created';
    const password = 'some password';
    const createSessionUsecase = new CreateSessionUsecase(mockDBConnection);

    await expect(
      createSessionUsecase.execute(username, password),
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("should be able to create a session", async () => {
    mockDBConnection.users.findOne = findOneUser;
    jest.spyOn(bcrypt, "compare").mockImplementationOnce(
      async () =>  true,
    );
    process.env.JWT_SECRET = 'secret';
    const username = 'not created';
    const password = 'password';
    const createSessionUsecase = new CreateSessionUsecase(mockDBConnection);

    const res = await createSessionUsecase.execute(username, password);

    expect(res.user.username).toBe(username);
  });
});
