// tests/integration/auth.test.js
const request = require("supertest");
const app = require("../../server");
const User = require("../../src/models/User");
const { setupTestDatabase, cleanupTestDatabase, closeTestDatabase } = require("../setup/database");

describe("POST /api/auth/login", () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  beforeEach(async () => {
    // Limpiar base de datos antes de cada test
    await cleanupTestDatabase();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  test("should login with valid credentials", async () => {
    // Crear usuario de prueba
    const userData = {
      name: "Test",
      lastName: "User",
      age: 25,
      email: "test@example.com",
      password: "Password123!",
    };
    await User.create(userData);

    // Hacer request de login
    const response = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "Password123!",
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.headers["set-cookie"]).toBeDefined();
  });

  test("should reject invalid credentials", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "wrong@example.com",
      password: "wrongpassword",
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
