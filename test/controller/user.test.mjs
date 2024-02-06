import { describe, it } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import {
  createUser,
  getSelfInfo,
  hashPassword,
  updateUser,
} from "../../controller/users.js";
import UserModel from "../../models/User.model.js";

describe("createUser Controller", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {
        firstName: "firstName",
        lastName: "lastName",
        email: "test@example.com",
        password: "password123",
      },
    };
    res = { status: sinon.stub().returnsThis(), send: sinon.spy() };
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should create a user Successfully and return 201 status", async () => {
    const hashedPassword = await hashPassword(req.body.password);
    const createdUser = {
      id: "id1234",
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.email,
      account_created: new Date(),
      account_updated: new Date(),
    };

    sinon.stub(UserModel, "create").resolves(createdUser);

    await createUser(req, res);

    expect(UserModel.create.calledOnce).to.be.true;
    expect(res.status.calledWithExactly(201)).to.be.true;
  });

  it("Send 500 error if user cannot be created", async () => {
    const errorMessage = "Error creating a user";
    sinon.stub(UserModel, "create").rejects(new Error(errorMessage));

    await createUser(req, res);

    expect(UserModel.create.calledOnce).to.be.true;
    expect(res.status.calledWithExactly(500)).to.be.true;
    expect(
      res.send.calledWithExactly({ error: "Error creating a user, Try Again" })
    ).to.be.true;
  });

  it("Should be able to update the user successfully", async () => {
    req.body = {
      firstName: "updatedFirstName",
      lastName: "updatedLastName",
      password: "updatedPassword",
    };
    req.user = {
      username: "test@example.com",
    };

    sinon.stub(UserModel, "update").resolves();

    await updateUser(req, res);

    expect(UserModel.update.calledOnce).to.be.true;
    expect(res.status.calledWithExactly(204)).to.be.true;
  });

  it("Should fail when updating a user", async () => {
    req.user = {
      username: "test@example.com",
    };
    const errorMessage = "Error updating user data, Try Again";
    sinon.stub(UserModel, "update").rejects(new Error(errorMessage));

    await updateUser(req, res);

    expect(UserModel.update.calledOnce).to.be.true;
    expect(res.status.calledWithExactly(500)).to.be.true;
    expect(
      res.send.calledWithExactly({
        error: "Error updating user data, Try Again",
      })
    ).to.be.true;
  });

  it("Should fetch user data", async () => {
    req.user = {
      username: "test@example.com",
    };
    const userData = {
      id: "id1234",
      firstName: "firstName",
      lastName: "lastName",
      username: "test@example.com",
    };

    sinon.stub(UserModel, "findOne").resolves(userData);

    await getSelfInfo(req, res);

    expect(UserModel.findOne.calledOnce).to.be.true;
    expect(res.status.calledWithExactly(200)).to.be.true;
  });

  it("Should fail to fetch user data", async () => {
    req.user = {
      username: "test@example.com",
    };
    const errorMessage = "Error while fetching user data, Try Again";
    sinon.stub(UserModel, "findOne").rejects(new Error(errorMessage));

    await getSelfInfo(req, res);

    expect(UserModel.findOne.calledOnce).to.be.true;
    expect(res.status.calledWithExactly(500)).to.be.true;
    expect(
      res.send.calledWithExactly({
        error: errorMessage,
      })
    ).to.be.true;
  });
});
