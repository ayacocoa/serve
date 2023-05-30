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
  //新建评论
  app.post("/insertcomment", (req, res) => {
    controller.insertComment(req, res);
  });
  //删除墙
  app.post("/deletefeedback", (req, res) => {
    controller.deleteFeedback(req, res);
  });
  //删除评价
  app.post("/deletecomment", (req, res) => {
    controller.deleteComment(req, res);
  });
  //分页查询wall
  app.post("/findwallpage", (req, res) => {
    controller.findWallPage(req, res);
  });
  //倒叙分页查墙的评论
  app.post("/findcommentpage", (req, res) => {
    controller.findCommentPage(req, res);
  });
};
