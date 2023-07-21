const express = require("express");
const path = require("path");
const { expressjwt } = require("express-jwt");
const SECRET_KEY = "coco2023";
const errorhandler = require("./controller/errorHandler");
const cors = require("cors");
//解析html
const ejs = require("ejs");
const config = require("./config/default");

const app = express();
//静态路径
app.use(express.static(__dirname + "/dist"));
app.use(express.static(__dirname + "/views"));

app.use(cors()); //使用cors中间件
//设置允许跨域
app.all("*", function (req, res, next) {
  //允许访问ip
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", "3.2.1");
  //返回json
  res.header("Content-Type", "application/json;charset=utf-8");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

//加入html视图
app.engine("html", ejs.__express);
app.set("view engine", "html");

//解析前端数据
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  expressjwt({
    secret: SECRET_KEY,
    algorithms: ["HS256"], // 使用何种加密算法解析
  }).unless({ path: ["/api/login", "/api/regist"] }) // 登录注册页无需校验
);
//引入路由
require("./routes/index")(app);

app.use(errorhandler);
app.listen(config.port, () => {
  console.log(`端口${config.port}开启`);
});
