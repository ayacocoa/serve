const dbModel = require("../lib/db");

exports.insertWall = async (req, res) => {
  let data = req.body;
  //console.log(data)
  await dbModel
    .insertWall([
      data.type,
      data.message,
      data.name,
      data.userId,
      data.moment,
      data.label,
      data.color,
      data.imgurl,
    ])
    .then((result) => {
      res.send({
        code: 200,
        message: result,
      });
    });
};

//新建反馈
exports.insertFeedback = async (req, res) => {
  let data = req.body;
  await dbModel
    .insertFeedback([data.wallId, data.userId, data.type, data.moment])
    .then((result) => {
      res.send({
        code: 200,
        message: result,
      });
    });
};

//新建评论
exports.insertComment = async (req, res) => {
  let data = req.body;
  await dbModel
    .insertComment([
      data.wallId,
      data.userId,
      data.imgurl,
      data.moment,
      data.comment,
      data.name,
    ])
    .then((result) => {
      res.send({
        code: 200,
        message: result,
      });
    });
};

//删除墙
exports.deleteWall = async (req, res) => {
  let data = req.body;
  await dbModel.deleteWall(data.id).then((result) => {
    res.send({
      code: 200,
      message: result,
    });
  });
};

//删除反馈
exports.deleteFeedback = async (req, res) => {
  let data = req.body;
  await dbModel.deleteFeedback(data.id).then((result) => {
    res.send({
      code: 200,
      message: result,
    });
  });
};

//删除评价
exports.deleteComment = async (req, res) => {
  let data = req.body;
  await dbModel.deleteComment(data.id).then((result) => {
    res.send({
      code: 200,
      message: result,
    });
  });
};

//分页查询wall并获取喜欢，不喜欢，撤销
exports.findWallPage = async (req, res) => {
  let data = req.body;
  await dbModel
    .findWallPage(data.page, data.pagesize, data.type, data.label)
    .then(async (result) => {
      for (let i = 0; i < result.length; i++) {
        //查找wall的一些相关数据
        //喜欢
        result[i].like = await dbModel.findbackCount(result[i].id, 0);
        //不喜欢
        result[i].report = await dbModel.findbackCount(result[i].id, 1);
        //撤销
        result[i].revoke = await dbModel.findbackCount(result[i], id, 2);
        //点赞
        result[i].islike = await dbModel.likeCount(result[i].id, data.id);
        //评论数
        result[i].commmentCount = await dbModel.commmentCount(result[i].id);
      }
      res.send({
        code: 200,
        message: result,
      });
    });
};
