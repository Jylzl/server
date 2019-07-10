"use strict";

module.exports = {
  dialect: "mysql", //数据库类型
  host: "localhost", //数据库地址
  port: "3306", //端口号
  username: "root", //用户名
  password: "929924", //密码
  database: "myblogdb", //表名
  define: {
    underscored: false,
    timestamps: true,
    paranoid: true
  },
  //连接池
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  timezone: "+08:00", //东八时区

  logging: function (sql) {
    // logger为log4js的Logger实例
    // logger.info(sql);
    return false;
  }
};