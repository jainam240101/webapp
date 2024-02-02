import { describe, it } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import emptyPayload from "../../middlewares/health/emptyPayload.js";

describe("Empty Payload Middleware", () => {
  it("Should pass when no query and body is passed", () => {
    const req = {
      query: {},
      body: {},
    };

    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    };

    const next = sinon.stub();

    emptyPayload(req, res, next);

    expect(res.status.called).to.be.false;
    expect(res.send.called).to.be.false;
    expect(next.called).to.be.true;
  });

  it("Should throw 400 when query and body is passed", () => {
    const req = {
      query: {
        test: "Hello",
      },
      body: {
        test: "body",
      },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    };

    const next = sinon.stub();

    emptyPayload(req, res, next);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.send.called).to.be.true;
    expect(next.called).to.be.false;
  });
});
