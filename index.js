const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const sqldb = require("./mysql");
const cors = require("cors");
const log4js = require("log4js");
log4js.configure("./config/log4js.json");
const logger = require("log4js").getLogger("index");

const passport = require("passport");
// 定义ip
// 定义端口号5000
const ip = "127.0.0.1";
const port = process.env.port || 5000;

// 数据库连接
sqldb.sequelize
  .sync({
    force: false
  })
  .then(function() {
    logger.info("数据库连接成功");
  })
  .catch(function(err) {
    logger.error("Server failed to start due to error: %s", err);
  });

app.use(
  log4js.connectLogger(log4js.getLogger("http"), {
    level: "trace"
  })
);

// passprt 初始化
app.use(
  require("express-session")({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

// app.use(passport.initialize());
require("./config/passport")(passport);

// 使用body-parser中间件
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

//使用cookies
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    // origin: 'http://' + ip + ':' + port
    origin: "http://www.lizilong.top"
  })
);

app.use(bodyParser.json());

// 静态文件托管
app.use("/u", express.static(__dirname + "/u"));

//设置请求头
app.all("*", function(req, res, next) {
  // res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Origin", req.headers.origin); //需要显示设置来源
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,X-Token"
  );
  res.header("Access-Control-Allow-Methods", "PUT,GET,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", true); //带cookies
  res.header("X-Powered-By", " 3.2.1");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

const server = app.listen(port, ip, function() {
  const host = server.address().address;
  const port = server.address().port;
  logger.info("服务器正在运行-请访问" + "  http://%s:%s", host, port);
});

// 引入api.js
const upload = require("./routes/api/upload");
const register = require("./routes/api/register");
const login = require("./routes/api/login");
const landUser = require("./routes/api/landUser");
const getdata = require("./routes/api/getdata");
const manage = require("./routes/api/manage");

// 使用routes
app.use("/api/upload", upload);
app.use("/api/register", register);
app.use("/api/login", login);
app.use("/api/landuser", landUser);
app.use("/api/getdata", getdata);
app.use("/api/manage", manage);
