const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const jestSorted = require("jest-sorted");
const topics = require("../db/data/test-data/topics");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

describe("GET/api/topics", () => {
  test("get status 200 response", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.topics)).toBe(true);
        expect(body.topics.length > 0).toBe(true);

        body.topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test("404: Invalid API", () => {
    return request(app)
      .get("/api/not_an_valid_path")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Endpoint");
      });
  });
});

describe("GET article by id", () => {
  test("get status 200 response", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe("object");

        expect(body).toMatchObject({
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  // test("404: article_id not exists", () => {
  //   return request(app)
  //     .get("/api/articles/9999")
  //     .expect(404)
  //     .then(({ body }) => {
  //       expect(body.msg).toBe("article_id is not found");
  //     });
  // });
  test("404: Invalid article_id", () => {
    return request(app)
      .get("/api/articles/nonsense")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid id");
      });
  });
});
