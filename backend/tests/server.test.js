const request = require("supertest");

const app = require("../server");

describe("/ endpoint tests", () => {
  test("GET / endpoint status code and response 404", async () =>
    request(app).get("/somethinghellarandom").expect(404));
  test("GET /api-docs.json endpoint status code and response 200", async () =>
    request(app).get("/api-docs.json").expect(200));
});
