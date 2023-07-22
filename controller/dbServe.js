const dbModel = require("../lib/db");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "coco2023";

//新建wall
exports.insertWall = async (req, res) => {
  let data = req.body;
  // console.log(data);

  await dbModel
    .insertWall([
      data.type,
      data.message,
      data.name,
      data.userId,
      data.moment,
      data.title,
      data.label,
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
//查询反馈
exports.findFeedback = async (req, res) => {
  let data = req.body;
  // console.log(data);
  await dbModel
    .findFeedback(data.wallId, data.userId, data.type)
    .then((result) => {
      res.send({
        code: 200,
        message: result,
      });
    });
};
//查询收藏
exports.findCollect = async (req, res) => {
  let data = req.body;
  let returnres = [];
  // console.log(data);
  await dbModel.findCollect(data.userId, data.type).then((result) => {
    let sipres = JSON.parse(JSON.stringify(result));
    for (let i = 0; i < sipres.length; i++) {
      dbModel.findWall(sipres[i].wallId).then((result) => {
        let simpleres = JSON.parse(JSON.stringify(result));
        returnres = [...returnres, ...simpleres];
      });
    }
    setTimeout(() => {
      console.log(returnres);
      res.send({
        code: 200,
        message: returnres,
      });
    }, 200); //优化
  });
};
//删除反馈
exports.deleteFeedback = async (req, res) => {
  let data = req.body;
  // console.log(data);
  await dbModel
    .deleteFeedback(data.wallId, data.userId, data.type)
    .then((result) => {
      res.send({
        code: 200,
        message: result,
      });
    });
};
//增加喜欢/不喜欢、评论数
exports.wallFeedback = async (req, res) => {
  let data = req.body;
  // console.log(data);
  await dbModel.wallFeedback(data.wallId, data.type).then((result) => {
    res.send({
      code: 200,
      message: result,
    });
  });
};
//减少喜欢/不喜欢、评论数
exports.subWallFeedback = async (req, res) => {
  let data = req.body;
  // console.log(data);
  await dbModel.subWallFeedback(data.wallId, data.type).then((result) => {
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

//查询
exports.findWall = async (req, res) => {
  let data = req.body;
  // console.log(data);
  await dbModel.findWall(data.id).then((result) => {
    // console.log(result);
    res.send({
      code: 200,
      message: result,
    });
  });
};

//分页查询wall
exports.findWallPage = async (req, res) => {
  let data = req.body;
  await dbModel
    .findWallPage(data.page, data.pagesize, data.type, data.label)
    .then(async (result) => {
      // console.log(result);
      res.send({
        code: 200,
        message: result,
      });
    });
};

//倒叙分页查墙的评论
exports.findCommentPage = async (req, res) => {
  let data = req.body;
  await dbModel
    .findCommentPage(data.page, data.pagesize, data.id)
    .then((result) => {
      res.send({
        code: 200,
        message: result,
      });
    });
};

//注册
exports.regist = async (req, res) => {
  let data = req.body;

  await dbModel.regist(data.username, data.password).then((result) => {
    res.send({
      code: 200,
      message: result,
    });
  });
};

//登录
exports.login = async (req, res) => {
  let data = req.body;
  // console.log(data);
  await dbModel.login(data.username, data.password).then((result) => {
    console.log(result);
    if (result.length && result != "不能为空") {
      const token = jwt.sign({ result }, SECRET_KEY, { expiresIn: "10h" });
      // console.log(token);
      res.send({
        code: 200,
        user: result,
        token,
      });
    } else {
      res.send({
        code: 204,
        message: "账号与密码不匹配或不存在",
      });
    }
  });
};

//获取用户数据
exports.getUser = async (req, res) => {
  let data = req.body;
  await dbModel.getUser(data.username, data.password).then((result) => {
    res.send({
      code: 200,
      user: result,
      token,
    });
  });
};

// 搜索
exports.searchFun = async (req, res) => {
  let data = req.body;
  await dbModel.searchFun(data.data).then((result) => {
    res.send({
      code: 200,
      result: result,
    });
  });
};
