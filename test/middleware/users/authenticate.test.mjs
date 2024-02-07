import { describe, it } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import { authenticate } from "../../../middlewares/users/authenticate.js";
import UserModel from "../../../models/User.model.js";
import bcrypt from "bcryptjs";

describe("authenticate Middleware", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { headers: {}, user: {} };
    res = { status: sinon.stub().returnsThis(), send: sinon.spy() };
    next = sinon.spy();
  });

  afterEach(() => {
    sinon.restore();
  });

  it("Middleware should pass when authentication is successful", async () => {
    req.headers.authorization =
      "Basic " +
      Buffer.from("existing@example.com:password123").toString("base64");

    const user = {
      username: "existing@example.com",
      password: await bcrypt.hash("password123", 10),
    };
    req.user = user;
    sinon.stub(UserModel, "findOne").resolves(user);
    sinon.stub(bcrypt, "compare").resolves(true);

    await authenticate(req, res, next);

    expect(next.calledOnce).to.be.true;
    expect(res.status.called).to.be.false;
    expect(res.send.called).to.be.false;
  });

  it("should return 400 when Authentication credentials are not passed", async () => {
    await authenticate(req, res, next);

    expect(next.called).to.be.false;
    expect(res.status.calledWithExactly(400)).to.be.true;
  });

  it("should return 401 when password doesn't match", async () => {
    req.headers.authorization =
      "Basic " +
      Buffer.from("existing@example.com:invalidpassword").toString("base64");

    const user = {
      username: "existing@example.com",
      password: await bcrypt.hash("password123", 10),
    };
    sinon.stub(UserModel, "findOne").resolves(user);
    sinon.stub(bcrypt, "compare").resolves(false);

    await authenticate(req, res, next);

    expect(next.called).to.be.false;
    expect(res.status.calledWithExactly(401)).to.be.true;
  });

  it("should return 400 when email is missing in Basic Authentication credentials", async () => {
    req.headers.authorization =
      "Basic " + Buffer.from(":password123").toString("base64");

    await authenticate(req, res, next);

    expect(next.called).to.be.false;
    expect(res.status.calledWithExactly(400)).to.be.true;
  });

  it("should return 400 when password is missing in Basic Authentication credentials", async () => {
    req.headers.authorization =
      "Basic " + Buffer.from("existing@example.com:").toString("base64");

    await authenticate(req, res, next);

    expect(next.called).to.be.false;
    expect(res.status.calledWithExactly(400)).to.be.true;
  });

  it("should fail if user doesnt exists", async () => {
    req.headers.authorization =
      "Basic " + Buffer.from("test@example.com:password123").toString("base64");

    sinon.stub(UserModel, "findOne").resolves(null);

    await authenticate(req, res, next);

    expect(next.called).to.be.false;
    expect(res.status.calledWithExactly(404)).to.be.true;
  });
});
