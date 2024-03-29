const controller = require("../controller/dbServe");

module.exports = function (app) {
  //test
  app.get("/test", (req, res) => {
    res.type("html");
    res.render("test");
  });

  //新建wall数据
  app.post("/insertwall", (req, res) => {
    controller.insertWall(req, res);
  });
  //新建反馈
  app.post("/insertfeedback", (req, res) => {
    controller.insertFeedback(req, res);
  });
  //删除反馈
  app.post("/deletefeedback", (req, res) => {
    controller.deleteFeedback(req, res);
  });
  //查询反馈
  app.post("/findfeedback", (req, res) => {
    controller.findFeedback(req, res);
  });
  //查询收藏
  app.post("/findcollect", (req, res) => {
    controller.findCollect(req, res);
  });
  //增加喜欢/不喜欢、评论数
  app.post("/wallfeedback", (req, res) => {
    controller.wallFeedback(req, res);
  });
  //减少喜欢/不喜欢、评论数
  app.post("/subwallfeedback", (req, res) => {
    controller.subWallFeedback(req, res);
  });
  //新建评论
  app.post("/insertcomment", (req, res) => {
    controller.insertComment(req, res);
  });
  //删除评价
  app.post("/deletecomment", (req, res) => {
    controller.deleteComment(req, res);
  });
  //查询wall
  app.post("/findwall", (req, res) => {
    controller.findWall(req, res);
  });
  //分页查询wall
  app.post("/findwallpage", (req, res) => {
    controller.findWallPage(req, res);
  });
  //倒叙分页查墙的评论
  app.post("/findcommentpage", (req, res) => {
    controller.findCommentPage(req, res);
  });

  //用户进入时的ip登记
  app.post("/signip", (req, res) => {
    let ip = req.ip;
    res.send({
      code: 200,
      ip: ip,
    });
  });
  //注册
  app.post("/api/regist", (req, res) => {
    controller.regist(req, res);
  });
  //登录
  app.post("/api/login", (req, res) => {
    controller.login(req, res);
  });
  //获取用户数据
  app.post("/getuser", (req, res) => {
    controller.getUser(req, res);
  });
  //搜索
  app.post("/search", (req, res) => {
    controller.searchFun(req, res);
  });
};
