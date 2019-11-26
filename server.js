const url = require('url');
const http = require('http');
const app = http.createServer((request, response) =&gt; {
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write(`hello`);
  response.end();
});

app.listen(3000);