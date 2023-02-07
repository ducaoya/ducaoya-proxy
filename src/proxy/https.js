const net = require("net");
const url = require("url");
const { pushLog } = require("../log");

function httpsProxy(proxyServer) {
  proxyServer.on("connect", (clientReq, clientSocket, head) => {
    // https proxy
    const reqUrl = url.parse("https://" + clientReq.url);
    console.log(
      "proxy for https request: " + reqUrl.href + "(path encrypted by ssl)"
    );
    pushLog(clientReq);

    const options = {
      port: reqUrl.port,
      host: reqUrl.hostname,
    };

    // 创建 socket 连接，并且将客户端的连接重定向到这个 socket
    const serverSocket = net.connect(options, () => {
      clientSocket.write(
        "HTTP/" +
          clientReq.httpVersion +
          " 200 Connection Established\r\n" +
          "Proxy-agent: Node.js-Proxy\r\n\r\n",
        "UTF-8",
        () => {
          // creating pipes in both ends
          serverSocket.write(head);
          serverSocket.pipe(clientSocket);
          clientSocket.pipe(serverSocket);
        }
      );

      // 错误处理
      clientSocket.on("error", (e) => {
        console.log("client socket error: " + e);
        serverSocket.end();
      });
    });

    // 错误处理
    serverSocket.on("error", (e) => {
      console.log("forward proxy server connection socket error: " + e);
      clientSocket.end();
    });
  });

  // 错误处理
  proxyServer.on("clientError", (err, clientSocket) => {
    console.log("client error: " + err);
    clientSocket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
  });
}

module.exports = { httpsProxy };
