const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const jestSorted = require("jest-sorted");
const topics = require("../db/data/test-data/topics");
const jsonEndPoint = require("../endpoints.json");

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

describe("GET/API ", () => {
  test("returns a JSON with all the endpoints.", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((result) => {
        expect(result.body).toEqual(jsonEndPoint);
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

  //   test("404: Invalid article_id", () => {
  //     return request(app)
  //       .get("/api/articles/999999")
  //       .expect(400)
  //       .then(({ body }) => {
  //         expect(body.msg).toBe("Invalid id");
  //       });
  //   });
});

describe("GET all the articles", () => {
  test("returns all the articles with a comment count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((result) => {
        result.body.articles.forEach((article) => {
          expect(typeof article.title).toBe("string");
          expect(typeof article.votes).toBe("number");
        });
      });
  });
});

describe("GET comments from an article_id", () => {
  test("returns all the comments from a given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((result) => {
        result.body.comments.forEach((comment) => {
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.article_id).toBe("number");
        });
      });
  });
});

describe("GET: status 200 - responds with an empty array", () => {
  it("returns an empty array when given an article_id with no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((result) => {
        expect(result.body.comments).toEqual([]);
      });
  });
});

describe("400: status not found", () => {
  test("returns 400 status and  Invalid input", () => {
    return request(app)
      .get("/api/articles/nonsense/comments")
      .expect(400)
      .then((result) => {
        expect(result.body.message).toBe("Invalid input");
      });
  });
});

describe("404: not found ", () => {
  test("returns 404 status code and message not found", () => {
    return request(app)
      .get("/api/articles/99999/comments")
      .expect(404)
      .then((result) => {
        expect(result.body.message).toBe("not found");
      });
  });
});
