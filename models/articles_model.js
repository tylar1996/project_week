const db = require("../db/connection");

exports.readArticleById = (article_id) => {
  return db
    .query(
      `
  SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes, CAST(COUNT(comments.article_id) AS INT) AS comment_count FROM articles
  JOIN comments ON comments.article_id = articles.article_id
  WHERE articles.article_id=$1
  GROUP BY articles.article_id
  
  `,
      [article_id]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "article_id is not found",
        });
      } else {
        return result.rows[0];
      }
    });
};

exports.readArticles = (
  topic,
  sort_by = "created_at",
  order = "DESC",
  limit = 999,
  p
) => {
  if (limit !== undefined && isNaN(limit)) {
    return Promise.reject({ status: 400, msg: "limit query must be a number" });
  } else if (limit !== undefined && limit.length === 0) {
    return Promise.reject({ status: 400, msg: "Invalid limit query" });
  } else if (p !== undefined && isNaN(p)) {
    return Promise.reject({ status: 400, msg: "q query must be a number" });
  } else if (p !== undefined && p.length === 0) {
    return Promise.reject({ status: 400, msg: "Invalid p query" });
  }

  if (
    topic === undefined &&
    sort_by === "created_at" &&
    limit === undefined &&
    p === undefined
  ) {
    let queryStr = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, CAST(COUNT(comments.article_id) AS INT) AS comment_count 
  FROM articles 
  LEFT JOIN comments ON comments.article_id = articles.article_id 
  GROUP BY articles.article_id 
  ORDER BY ${sort_by} ${order}`;
    return db.query(queryStr).then(({ rowCount }) => {
      const total_count = rowCount;
      return db.query(queryStr).then(({ rows }) => {
        return { rows, total_count };
      });
    });
  }

  if (topic === undefined && sort_by === "created_at") {
    let queryStr = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, CAST(COUNT(comments.article_id) AS INT) AS comment_count 
    FROM articles 
    LEFT JOIN comments ON comments.article_id = articles.article_id 
    GROUP BY articles.article_id 
    ORDER BY ${sort_by} ${order}`;

    return db.query(queryStr).then(({ rowCount }) => {
      const total_count = rowCount;
      if (p !== undefined) {
        return db
          .query(`${queryStr} OFFSET ${p - 1} * ${limit};`)
          .then(({ rows }) => {
            return { rows, total_count };
          });
      } else {
        return db.query(`${queryStr} LIMIT ${limit};`).then(({ rows }) => {
          return { rows, total_count };
        });
      }
    });
  }

  const validColumns = [
    "article_id",
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "comment_count",
  ];

  if (validColumns.includes(sort_by) === false) {
    return Promise.reject({ status: 400, msg: "Invalid column" });
  }

  if (order !== "asc" && order !== "DESC") {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  let queryStr = `
  SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, CAST(COUNT(comments.article_id) AS INT) AS comment_count FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id
  `;
  const queryValues = [];

  if (typeof topic === "string" && topic.length === 0) {
    return Promise.reject({ status: 400, msg: "Invalid topic" });
  }

  if (topic) {
    queryStr += `WHERE topic = $1`;
    queryValues.push(topic);
  }

  queryStr += `
  GROUP BY articles.article_id
  `;

  if (sort_by) {
    queryStr += `ORDER BY ${sort_by} `;
  } else {
    queryStr += `ORDER BY created_at `;
  }

  let total_count;
  return db
    .query(queryStr, queryValues)
    .then(({ rowCount }) => {
      total_count = rowCount;
    })
    .then(() => {
      order === "asc" ? (queryStr += "ASC") : (queryStr += `${order}`);

      if (p === undefined) {
        queryStr += ` LIMIT ${limit}`;
      } else {
        queryStr += ` OFFSET ${p - 1} * ${limit}`;
      }

      return db
        .query(queryStr, queryValues)
        .then(({ rows, rowCount }) => {
          if (rowCount === 0) {
            return Promise.all([
              rows,
              rowCount,
              db.query(`SELECT * FROM topics WHERE slug=$1;`, [topic]),
            ]);
          }
          return Promise.all([rows, rowCount]);
        })
        .then(([rows, rowCount, topicsResult]) => {
          if (topicsResult !== undefined) {
            if (topicsResult.rowCount > 0) {
              return Promise.reject({
                status: 200,
                msg: "No article with this topic",
              });
            }
            return Promise.reject({ status: 404, msg: "Topic does not exist" });
          }
          return { rows, total_count };
        });
    });
};

exports.readCommentsByArticleId = (article_id, limit = 999, p) => {
  if (isNaN(limit)) {
    return Promise.reject({ status: 400, msg: "limit query must be a number" });
  } else if (limit.length === 0) {
    return Promise.reject({ status: 400, msg: "Invalid limit query" });
  } else if (p !== undefined && isNaN(p)) {
    return Promise.reject({ status: 400, msg: "q query must be a number" });
  } else if (p !== undefined && p.length === 0) {
    return Promise.reject({ status: 400, msg: "Invalid p query" });
  }

  let total_count;
  let queryStr = `SELECT comment_id, body, author, votes, created_at FROM comments WHERE article_id=$1 ORDER BY created_at desc`;
  return db
    .query(`SELECT * FROM comments WHERE article_id=$1`, [article_id])
    .then(({ rowCount }) => {
      total_count = rowCount;
    })
    .then(() => {
      if (p === undefined) {
        return db
          .query(`${queryStr} LIMIT ${limit};`, [article_id])
          .then(({ rows, rowCount }) => {
            if (rowCount === 0) {
              return Promise.all([
                rows,
                db.query(`SELECT * FROM articles WHERE article_id=$1;`, [
                  article_id,
                ]),
              ]);
            }
            return Promise.all([rows]);
          })
          .then(([rows, articlesResult]) => {
            if (articlesResult !== undefined) {
              if (articlesResult.rowCount > 0) {
                return Promise.reject({
                  status: 200,
                  msg: "No comments with this article_id",
                });
              }
              return Promise.reject({
                status: 404,
                msg: "article_id does not exist",
              });
            }
            return { rows, total_count };
          });
      } else {
        return db
          .query(`${queryStr} LIMIT ${limit} OFFSET ${p - 1} * ${limit}`, [
            article_id,
          ])
          .then(({ rows, rowCount }) => {
            if (rowCount === 0) {
              return Promise.all([
                rows,
                db.query(`SELECT * FROM articles WHERE article_id=$1;`, [
                  article_id,
                ]),
              ]);
            }
            return Promise.all([rows]);
          })
          .then(([rows, articlesResult]) => {
            if (articlesResult !== undefined) {
              if (articlesResult.rowCount > 0) {
                return Promise.reject({
                  status: 200,
                  msg: "No comments with this article_id",
                });
              }
              return Promise.reject({
                status: 404,
                msg: "article_id does not exist",
              });
            }
            return { rows, total_count };
          });
      }
    });
};
