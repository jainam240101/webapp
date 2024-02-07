import { describe, it } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import { allowOnlyGet } from "../../middlewares/health/requestChecks.js";

describe("Only Allow Get Methods", () => {
  it("Should pass by sending GET method", () => {
    const req = {
      method: "GET",
    };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    };
    const next = sinon.stub();
    allowOnlyGet(req, res, next);
    expect(res.status.called).to.be.false;
    expect(res.send.called).to.be.false;
    expect(next.calledOnce).to.be.true;
  });

  it("Should throw 405 when calling with POST Request", () => {
    const req = {
      method: "POST",
    };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    };
    const next = sinon.stub();
    allowOnlyGet(req, res, next);
    expect(res.status.calledWith(405)).to.be.true;
    expect(res.send.calledOnce).to.be.true;
    expect(next.called).to.be.false;
  });
});
