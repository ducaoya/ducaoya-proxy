const http = require("http");
const url = require("url");
const { pushLog } = require("../log");

/**
 * http 请求的代理
 * @param {*} clientReq
 * @param {*} clientRes
 */
function httpProxy(clientReq, clientRes) {
  const reqUrl = url.parse(clientReq.url);
  console.log("proxy for http request: " + reqUrl.href);
  pushLog(clientReq);

  const options = {
    hostname: reqUrl.hostname, // 我的项目需求会把这里写成 localhost
    port: reqUrl.port,
    path: reqUrl.path,
    method: clientReq.method,
    headers: clientReq.headers,
  };

  // 使用 捕获到的请求创建 socket 连接，然后将返回值返回客户端
  const serverConnection = http.request(options, function (res) {
    clientRes.writeHead(res.statusCode, res.headers);
    res.pipe(clientRes);
  });

  clientReq.pipe(serverConnection);

  clientReq.on("error", (e) => {
    console.log("client socket error: " + e);
  });

  serverConnection.on("error", (e) => {
    console.log("server socket error: " + e);
  });
}

module.exports = { httpProxy };
