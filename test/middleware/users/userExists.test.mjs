import { describe, it } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import { checkUserExists } from "../../../middlewares/users/emailExists.js";
import UserModel from "../../../models/User.model.js";

console.log(checkUserExists);

describe("Middeware test if user exists or not", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("Should pass if user does not exists", async () => {
    const req = {
      body: {
        email: "test@gmail.com",
      },
    };
    const res = {};
    const next = sinon.spy();
    sinon.stub(UserModel, "findOne").resolves();

    await checkUserExists(req, res, next);

    expect(next.calledOnce).to.be.true;
    expect(UserModel.findOne.calledOnce).to.be.true;
    expect(
      UserModel.findOne.calledWithExactly({
        where: { username: "test@gmail.com" },
      })
    ).to.be.true;
  });

  it("Should fail if email exists", async () => {
    const req = {
      body: {
        email: "test@gmail.com",
      },
    };

    const res = { status: sinon.stub().returnsThis(), send: sinon.spy() };

    const next = sinon.spy();

    sinon.stub(UserModel, "findOne").resolves({ username: "test@gmail.com" });

    await checkUserExists(req, res, next);
    expect(res.status.calledWith(400)).to.be.true;
    expect(res.send.calledOnce).to.be.true;
    expect(next.calledOnce).to.be.false;
  });
});
