require(`http`).createServer((req, res) => {
  console.log(new Date().toString(), req.url);
  if (req.url === `/`) {
    res.end(require(`fs`).readFileSync(__dirname + `/index.html`));
    return;
  }
  if (req.url === `/client.js`) {
    res.end(require(`fs`).readFileSync(__dirname + `/client.js`));
    return;
  }
  if (req.url === `/react-dom.development.js`) {
    res.end(require(`fs`).readFileSync(__dirname + `/react-dom.development.js`));
    return;
  }
  if (req.url === `/react.development.js`) {
    res.end(require(`fs`).readFileSync(__dirname + `/react.development.js`));
    return;
  }
  if (req.url === `/react-dom.production.min.js`) {
    res.end(require(`fs`).readFileSync(__dirname + `/react-dom.production.min.js`));
    return;
  }
  if (req.url === `/react.production.min.js`) {
    res.end(require(`fs`).readFileSync(__dirname + `/react.production.min.js`));
    return;
  }
}).listen(3000);