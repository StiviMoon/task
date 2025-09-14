// tests/unit/password.test.js
const { validatePassword } = require("../../src/utils/validators");

describe("Password Validation", () => {
  test("should accept valid password", () => {
    const validPassword = "Password123!";
    expect(validatePassword(validPassword)).toBe(true);
  });

  test("should reject weak password", () => {
    const weakPassword = "123";
    expect(validatePassword(weakPassword)).toBe(false);
  });
});
