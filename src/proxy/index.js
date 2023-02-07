const http = require("http");
const { httpProxy } = require("./http");
const { httpsProxy } = require("./https");

function proxyServer(port) {
  const proxyServer = http.createServer(httpProxy);

  httpsProxy(proxyServer);

  // 错误处理
  proxyServer.on("clientError", (err, clientSocket) => {
    console.log("client error: " + err);
    clientSocket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
  });

  // 启动服务
  proxyServer.listen(7788);

  console.log("your proxy server start at : ", `127.0.0.1:${port}`);
}

module.exports = { proxyServer };
