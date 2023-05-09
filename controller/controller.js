const db = require("../db/connection");

exports.getTopic = (req, res) => {
  db.query(`SELECT * FROM topicsTablePromise`).then((result) => {
    const topics = result.rows.map((row) => ({
      slug: row.slug,
      description: row.description,
    }));
    res.json({ topics });
  })
  .catch((err) => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  })
};
