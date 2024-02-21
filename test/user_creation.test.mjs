import { describe, it } from "mocha";
import { expect } from "chai";
import axios from "axios";
import pkg from "base-64";
const { encode } = pkg;

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/v1",
});

let username;
let password;

describe("User Creation ", () => {
  before(async () => {
    username = "test75@gmail.com";
    password = "Test@123";
  });

  it("Should be able to create user", async () => {
    const data = {
      firstName: "firstName",
      lastName: "lastName",
      email: username,
      password: password,
    };
    const res = await axiosInstance.post("/users", data);

    // Checks
    expect(res.status).equal(201);
    expect(res.data.firstName).equal(data.firstName);
    expect(res.data.lastName).equal(data.lastName);
    expect(res.data.username).equal(username);
    expect(res.data.id).to.not.be.null;
    expect(res.data.account_created).to.not.be.null;
    expect(res.data.account_updated).to.not.be.null;
  });

  it("Should fail if we create user with same username", async () => {
    try {
      const data = {
        firstName: "firstName",
        lastName: "lastName",
        email: username,
        password: password,
      };
      await axiosInstance.post("/users", data);
    } catch (error) {
      expect(error.response.status).equal(400);
    }
  });

  it("Should fail if we pass in wrong credentials while updating a user", async () => {
    try {
      const authToken = encode(`${username}:${password}@something`);
      const headers = {
        Authorization: `Basic ${authToken}`,
      };
      const data = {
        firstName: "Mike",
        lastName: "Ross",
      };
      await axiosInstance.put("/users/self", data, { headers });
    } catch (error) {
      expect(error.response.status).equal(401);
    }
  });

  it("Should be able to update user data", async () => {
    const authToken = encode(`${username}:${password}`);
    const headers = {
      Authorization: `Basic ${authToken}`,
    };
    const data = {
      firstName: "Mike",
      lastName: "Ross",
    };
    const res = await axiosInstance.put("/users/self", data, { headers });
    expect(res.status).equal(204);
  });

  it("Checking if the data was updated successfully or not", async () => {
    const authToken = encode(`${username}:${password}`);
    const headers = {
      Authorization: `Basic ${authToken}`,
    };

    const res = await axiosInstance.get("/users/self", { headers });
    expect(res.status).equal(200);
    expect(res.data.firstName).equal("Mike");
    expect(res.data.lastName).equal("Ross");
    expect(res.data.username).equal(username);
    expect(res.data.id).to.not.be.null;
    expect(res.data.account_created).to.not.be.null;
    expect(res.data.account_updated).to.not.be.null;
  });
});
