const { postUserController } = require("./userController");


//************************ Create User ************************//
jest.mock("../models/userModel", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "adminPassword";
const SECRET = "yourSecretKey";
const jwt = require("jsonwebtoken");
jest.mock("jsonwebtoken");

describe("postUserController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if email or password are empty", async () => {
    await expect(postUserController("", "")).rejects.toThrow(
      "Fields are empty"
    );
  });

  it("should throw an error if email is already taken", async () => {
    const mockedUser = { id: 1, email: "test@example.com" };
    const User = require("../models/userModel");
    User.findOne.mockResolvedValue(mockedUser);

    await expect(
      postUserController("test@example.com", "password")
    ).rejects.toThrow("That mail is allready taken");
  });

  it("should create an admin user and return token if provided with admin credentials", async () => {
    const User = require("../models/user");
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ id: 1, email: ADMIN_EMAIL, role: "admin" });

    jwt.sign.mockReturnValue("generatedToken");

    const token = await postUserController(ADMIN_EMAIL, ADMIN_PASSWORD);

    expect(token).toBe("generatedToken");
    expect(User.create).toHaveBeenCalledWith({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: "admin",
    });
    expect(jwt.sign).toHaveBeenCalledWith({ id: 1, role: "admin" }, SECRET, {
      expiresIn: "1y",
    });
  });

  it("should create a common user and return token if provided with non-admin credentials", async () => {
    const User = require("../models/user");
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ id: 1, email: "test@example.com" });

    jwt.sign.mockReturnValue("generatedToken");

    const token = await postUserController("test@example.com", "password");

    expect(token).toBe("generatedToken");
    expect(User.create).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password",
    });
    expect(jwt.sign).toHaveBeenCalledWith({ id: 1, role: undefined }, SECRET, {
      expiresIn: "1y",
    });
  });
});