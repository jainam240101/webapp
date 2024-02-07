import { describe, it } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import { verifyPayload } from "../../../middlewares/users/checkPayload.js";

describe("Middleware test to check payload for creating User", () => {
  it("Should pass on correct payload", async () => {
    const req = {
      body: {
        firstName: "firstName",
        lastName: "lastName",
        email: "email@example.com",
        password: "password",
      },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    };
    const next = sinon.stub();
    verifyPayload(req, res, next);

    expect(next.calledOnce).to.be.true;
    expect(res.status.called).to.be.false;
    expect(res.send.called).to.be.false;
  });

  it("Should fail on incorrect payload", async () => {
    const req = {
      body: {
        firstName: "firstName",
        id: "id",
        password: "password",
      },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    };
    const next = sinon.stub();
    verifyPayload(req, res, next);

    expect(next.calledOnce).to.be.false;
    expect(res.status.calledWith(400)).to.be.true;
    expect(res.send.calledOnce).to.be.true;
  });
});
