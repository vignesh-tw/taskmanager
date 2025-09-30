const request = require("supertest");
const { expect } = require("chai");
const app = require("../server");
require("./setup");

describe("Auth Routes", () => {
  describe("POST /api/auth/register", () => {
    it("should register a new patient", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        userType: "patient",
      });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("status", "success");
      expect(res.body.data).to.have.property("user");
      expect(res.body.data.user).to.have.property("name", "John Doe");
      expect(res.body.data.token).to.be.a("string");
    });

    it("should register a new therapist", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Dr. Smith",
          email: "smith@example.com",
          password: "password123",
          userType: "therapist",
          specialization: "Clinical",
          rate: { amount: 100, currency: "USD" },
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("data");
      expect(res.body.data.user).to.have.property("name", "Dr. Smith");
      expect(res.body.data.token).to.be.a("string");
    });

    it("should not register with invalid user type", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Invalid User",
        email: "invalid@example.com",
        password: "password123",
        userType: "invalid",
      });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("status", "error");
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      // Create a test user
      await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        userType: "patient",
      });
    });

    it("should login with valid credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("data");
      expect(res.body.data).to.have.property("token");
    });

    it("should not login with invalid password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "wrongpassword",
      });

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property("status", "error");
    });
  });
});
