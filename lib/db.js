const mysql = require("mysql");
const config = require("../config/default");

const db = mysql.createConnection({
  host: config.database.HOST,
  user: config.database.USER,
  password: config.database.PASSWORD,
});

//链接指定数据库
const pool = mysql.createPool({
  host: config.database.HOST,
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
    userId VARCHAR(100) NOT NULL COMMENT '创建者ID',
    moment VARCHAR(100) NOT NULL COMMENT '时间',
    label INT NOT NULL COMMENT '标签',
    color INT COMMENT '颜色',
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
        moment VARCHAR(100) NOT NULL COMMENT '时间',
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
}
create();

exports.insertWall = (val) => {
  let _sql =
    "insert into walls set type=?,message=?,name=?,userId=?,moment=?,label=?,color=?,imgurl=?";
  return query(_sql, val);
};
