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
  test("400: Invalid API", () => {
    return request(app)
      .get("/api/not_an_valid_path")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Path");
      });
  });
});

describe("GET article by id", () => {
  test("get status 200 response", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body.article).toBe("object");

        expect(body.article).toMatchObject({
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          article_id: 1,
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          comment_count: 11,
        });
      });
  });
  test("404: article_id not exists", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article_id is not found");
      });
  });
  test("400: Invalid article_id", () => {
    return request(app)
      .get("/api/articles/nonsense")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid id");
      });
  });
});

describe("GET articles", () => {
  test("200: get all articles including property comment_count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.articles)).toBe(true);
        expect(body.articles.length).toBe(12);
        expect(body.total_count).toBe(12);

        body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("400: invalid p query which is not a number", () => {
    return request(app)
      .get("/api/articles?p=two")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("q query must be a number");
      });
  });
  test("404: topic does not exist", () => {
    return request(app)
      .get("/api/articles?topic=not_topic")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Topic does not exist");
      });
  });
});

describe("GET comments", () => {
  test("200: get comments by article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.comments)).toBe(true);
        expect(body.comments.length).toBe(11);
        expect(body.total_count).toBe(11);
        expect(body.comments).toBeSortedBy("created_at", { descending: true });

        body.comments.forEach((comment) => {
          expect(Object.keys(comment).length).toBe(5);
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
      });
  });
  test("200: get comments by article_id with limit query", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=11")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.comments)).toBe(true);
        expect(body.comments.length).toBe(11);
        expect(body.total_count).toBe(11);
        body.comments.forEach((comment) => {
          expect(Object.keys(comment).length).toBe(5);
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
      });
  });
  test("400: invalid limit query which is not a number", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=two")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("limit query must be a number");
      });
  });
  test("404: article_id does not exist", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article_id does not exist");
      });
  });
});

describe("POST comment", () => {
  test("201: post comment by article_id", () => {
    const newComment = { username: "lurker", body: "totally" };
    return request(app)
      .post("/api/articles/11/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
        expect(body.comment).toMatchObject({
          comment_id: 19,
          body: "totally",
          article_id: 11,
          author: "lurker",
          votes: 0,
          created_at: expect.stringMatching(datePattern),
        });
      });
  });
  test("400: username does not exist", () => {
    const newComment = { username: "not_exist_user", body: "totally" };
    return request(app)
      .post("/api/articles/11/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("username does not exist");
      });
  });
  test("400: article_id does not exist", () => {
    const newComment = { username: "not_exist_user", body: "totally" };
    return request(app)
      .post("/api/articles/999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article_id does not exist");
      });
  });
  test("400: wrong data type", () => {
    const newComment = { username: "lurker", body: true };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Wrong data type");
      });
  });
  test("400: incomplete comment", () => {
    const newComment = { username: "lurker" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Incomplete comment");
      });
  });
});
