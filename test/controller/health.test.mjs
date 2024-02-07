import { describe, it } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import { checkHealth } from "../../controller/health.js";
import { Sequelize } from "sequelize";

describe("Health Controller Function", () => {
  let authenticateStub;

  beforeEach(() => {
    authenticateStub = sinon.stub(Sequelize.prototype, "authenticate");
  });

  afterEach(() => {
    authenticateStub.restore();
  });

  it("should pass when sequelize connection is successful", async () => {
    authenticateStub.resolves();

    const req = {};
    const res = {
      setHeader: sinon.stub(),
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    };

    await checkHealth(req, res);

    expect(authenticateStub.calledOnce).to.be.true;
    expect(res.setHeader.calledWith("Cache-Control", "no-cache")).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.send.calledOnce).to.be.true;
  });

  it("should throw 503 when sequelize connection fails", async () => {
    const error = new Error("Connection failed");
    authenticateStub.rejects(error);

    const req = {};
    const res = {
      setHeader: sinon.stub(),
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    };

    await checkHealth(req, res);

    expect(authenticateStub.calledOnce).to.be.true;
    expect(res.setHeader.calledWith("Cache-Control", "no-cache")).to.be.true;
    expect(res.status.calledWith(503)).to.be.true;
    expect(res.send.calledOnce).to.be.true;
  });
});
