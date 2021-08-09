// Language=HTML
exports.buildPage = (title, content) => `<!DOCTYPE html>
<html lang="ka">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <link rel="stylesheet" href="/main.css">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <header>Header</header>
  <main class="main-content" role="main">
    <h1>${title}</h1>
    <article class="main-page-content">
      ${content}
    </article>
  </main>
  <footer>Footer</footer>
</body>
</html>
`;
