import { describe, it } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import updatePayload from "../../../middlewares/users/updatePayload.js";

describe("Only allow certain fields to update user data", () => {
  it("Should pass only by sending correct fields", () => {
    const req = {
      body: {
        firstName: "firstName",
        lastName: "lastName",
        password: "password",
      },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    };
    const next = sinon.stub();
    updatePayload(req, res, next);
    expect(res.status.called).to.be.false;
    expect(res.send.called).to.be.false;
    expect(next.calledOnce).to.be.true;
  });
  it("Should fail by sending invalid fields", () => {
    const req = {
      body: {
        id: "id",
      },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    };
    const next = sinon.stub();
    updatePayload(req, res, next);
    expect(res.status.calledWith(400)).to.be.true;
    expect(res.send.calledOnce).to.be.true;
    expect(next.called).to.be.false;
  });
});
