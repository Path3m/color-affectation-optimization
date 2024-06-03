const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    //res.writeHead(200, { 'content-type': 'text/html' })
    fs.createReadStream('index.html').pipe(res)
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});