const mysql = require("mysql");
const config = require("../config/default");

const db = mysql.createConnection({
  host: config.database.HOST,
  port: config.database.PORT,
  user: config.database.USER,
  password: config.database.PASSWORD,
});

//链接指定数据库
const pool = mysql.createPool({
  host: config.database.HOST,
  port: config.database.PORT,
  user: config.database.USER,
  password: config.database.PASSWORD,
  database: config.database.WALL,
});

//直接使用pool.query;
let bdbs = (sql, values) => {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

//通过pool.getConnection 获取链接
let query = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
          connection.release(); //释放连接
        });
      }
    });
  });
};

//创建数据库
let WALL = `create database if not exists WALL default charset utf8 collate utf8_general_ci`;
let createDatabase = (db) => {
  return bdbs(db, []);
};

//数据表
//主页
let walls = `create table if not exists walls(
    id INT NOT NULL AUTO_INCREMENT,
    type INT NOT NULL COMMENT '类型 0_信息 1_图片',
    message VARCHAR(1000) COMMENT '留言',
    name VARCHAR(100) NOT NULL COMMENT '用户名',
    userId VARCHAR(100) COMMENT '创建者ID',
    moment VARCHAR(100) NOT NULL COMMENT '时间',
    title VARCHAR(100) NOT NULL COMMENT '标题',
    tolike VARCHAR(100) INT COMMENT '喜欢',
    dislike VARCHAR(100) INT COMMENT '不喜欢',
    comment VARCHAR(100) INT COMMENT '评论数',
    collect VARCHAR(100) INT COMMENT '收藏数',
    label INT COMMENT '标签',
    imgurl VARCHAR(100) COMMENT '图片路径',
    PRIMARY KEY ( id )
)`;

//留言反馈
let feedback = `
    create table if not exists feedbacks(
        id INT NOT NULL AUTO_INCREMENT,
        wallId INT NOT NULL COMMENT '留言ID',
        userID VARCHAR(100) NOT NULL COMMENT '反馈者ID',
        type INT NOT NULL COMMENT '类型 0_喜欢 1_不喜欢 2_撤销',
        moment VARCHAR(100) NOT NULL COMMENT '时间',
        PRIMARY KEY (id)
    )`;

// 评论区
let comments = `
    create table if not exists comments(
        id INT NOT NULL AUTO_INCREMENT,
        wallId INT NOT NULL COMMENT '留言ID',
        userID VARCHAR(100) NOT NULL COMMENT '评论者ID',
        imgurl VARCHAR(100)  COMMENT '头像',
        comment VARCHAR(1000) COMMENT '评论内容',
        name VARCHAR(100) NOT NULL COMMENT '用户名',
        moment VARCHAR(100) NOT NULL COMMENT '时间',
        PRIMARY KEY (id)
    )`;

let users = `
    create table if not exists users(
        id INT NOT NULL AUTO_INCREMENT,
        username VARCHAR(100) NOT NULL COMMENT '用户名',
        password VARCHAR(100) NOT NULL COMMENT '密码',
        imgurl VARCHAR(1000) COMMENT '头像',
        nickname VARCHAR(100) COMMENT '昵称',
        PRIMARY KEY (id)
    )`;

let createTable = (sql) => {
  return query(sql, []);
};

async function create() {
  await createDatabase(WALL);
  createTable(walls);
  createTable(feedback);
  createTable(comments);
  createTable(users);
}
//创建
// create();

//新建walls
exports.insertWall = (val) => {
  let _sql =
    "insert into walls set type=?,message=?,name=?,userId=?,moment=?,title=?";
  return query(_sql, val);
};
// ,label=?,color=?,imgurl=?
//新建反馈
exports.insertFeedback = (value) => {
  let _sql = "insert into feedbacks set wallId=?,userId=?,type=?,moment=?";
  return query(_sql, value);
};
//删除反馈
exports.deleteFeedback = (wallId, userId, type) => {
  let _sql = `delete from feedbacks where wallId='${wallId}' and userId='${userId}' and type='${type}'`;
  return query(_sql);
};

//新建评论
exports.insertComment = (value) => {
  let _sql =
    "insert into comments set wallId=?,userId=?,imgUrl=?,moment=?,comment=?,name=?";
  return query(_sql, value);
};

//删除wall
exports.deleteWall = (id) => {
  let _sql = `delete a,b,c from walls a left walls a left join feedbacks b on a.id=b.wallId left join comments c on a.id=c.wallId where a.id ='${id}'`;
  return query(_sql);
};

//删除评论
exports.deleteComment = (id) => {
  let _sql = `delete from comments where id = '${id}'`;
  return query(_sql);
};

//查询
exports.findWall = (id) => {
  // console.log(id);
  let _sql = `select * from walls where id = '${id}'`;
  // console.log(_sql);
  return query(_sql);
};

//分页查询
exports.findWallPage = (page, pagesize, type, label) => {
  let _sql;
  if (label == -1) {
    _sql = `select * from walls where type = '${type}' order by id desc limit 
    ${(page - 1) * pagesize},${pagesize}`;
  } else {
    _sql = `select * from walls where type = '${type}' and label = '${label}' order by id desc limit 
    ${(page - 1) * pagesize},${pagesize}`;
  }
  return query(_sql);
};

//查询评论数据
exports.findCommentPage = (page, pagesize, id) => {
  let _sql = `select * from comments where wallId='${id}' order by id desc limit 
  ${(page - 1) * pagesize},${pagesize}`;
  return query(_sql);
};

//查询反馈数据
exports.findFeedback = (wallid, userId, type) => {
  let _sql = `select * from feedbacks where wallId='${wallid}' and type='${type}' and userId='${userId}'`;
  return query(_sql);
};
//查询指定收藏
exports.findCollect = (userId, type) => {
  let _sql = `select * from feedbacks where  type='${type}' and userId='${userId}'`;
  return query(_sql);
};

//增加反馈
exports.wallFeedback = (wallid, type) => {
  let _sql;
  switch (type) {
    case 0:
      _sql = `update walls set tolike = tolike + 1 where id='${wallid}'`;
      break;
    case 1:
      _sql = `update walls set dislike = dislike + 1 where id='${wallid}'`;
      break;
    case 2:
      _sql = `update walls set comment = comment + 1 where id='${wallid}'`;
      break;
    case 3:
      _sql = `update walls set collect = collect + 1 where id='${wallid}'`;
      break;
  }
  return query(_sql);
};
//减少反馈
exports.subWallFeedback = (wallid, type) => {
  let _sql;
  switch (type) {
    case 0:
      _sql = `update walls set tolike = tolike - 1 where id='${wallid}'`;
      break;
    case 1:
      _sql = `update walls set dislike = dislike - 1 where id='${wallid}'`;
      break;
    case 2:
      _sql = `update walls set comment = comment - 1 where id='${wallid}'`;
      break;
    case 3:
      _sql = `update walls set collect = collect - 1 where id='${wallid}'`;
      break;
  }
  return query(_sql);
};

//查询评论总数
exports.commmentCount = (wid) => {
  let _sql = `select count(*) as count from comments where wallId='${wid}'`;
  return query(_sql);
};

//注册
exports.regist = (username, password) => {
  if (username && password) {
    let _sql = `insert into users set username='${username}',password='${password}',nickname='${username}'`;
    return query(_sql);
  } else {
    return new Promise((resolve, reject) => {
      resolve("不能为空");
    });
  }
};

//登录
exports.login = (username, password) => {
  // console.log("Login", username, password);
  if (username && password) {
    let _sql = `select * from users where username='${username}' and password='${password}'`;
    return query(_sql);
  } else {
    return new Promise((resolve, reject) => {
      resolve("不能为空");
    });
  }
};

//获取用户数据
exports.getUser = (username, password) => {
  let _sql = `select * from users where username='${username}' and password='${password}'`;
  return query(_sql);
};

//搜索功能
exports.searchFun = (str) => {
  let _sql = `select * from walls where title like '%${str}%' or name like '%${str}%'`;
  return query(_sql);
};
