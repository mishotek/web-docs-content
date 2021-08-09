const express = require('express');
const cors = require('cors');
const {staticBuild} = require("../scripts/static-build");

const app = express();
const PORT = 3000;
let documents;

app.use(cors());

app.get(/^\/docs\/.+$/, (req, res) => {
  const slug = req.url
    .replace('/docs/', '')
    .replace(/\/$/, '');
  const doc = documents.get(slug);

  if (doc) {
    return res.send(doc);
  }

  return res.status(404).send();
});

staticBuild().then(docs => {
  documents = docs;

  app.listen(PORT, () => {
    console.log(`Server running at at http://localhost:${PORT}`);
  });
});