"use strict";
module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define(
    "user", {
      // 用户ID
      user_id: {
        type: DataTypes.INTEGER(8),
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        comment: "用户ID"
      },
      // 用户名
      user_name: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: "用户名"
      },
      // 密码
      user_pwd: {
        type: DataTypes.CHAR(32),
        allowNull: false,
        comment: "密码"
      },
      // 手机号码
      user_phone: {
        type: DataTypes.CHAR(11),
        allowNull: false,
        comment: "手机号码"
      },
      // 邮箱号码
      user_email: {
        type: DataTypes.STRING(320),
        allowNull: false,
        comment: "邮箱号码"
      },
      // QQ账号
      user_qq: {
        type: DataTypes.STRING(11),
        allowNull: true,
        comment: "QQ账号"
      },
      // GitHub地址
      user_github: {
        type: DataTypes.STRING(32),
        allowNull: true,
        comment: "GitHub地址"
      },
      // 密保问题编号
      security_no: {
        type: DataTypes.INTEGER(8),
        allowNull: false,
        comment: "密保问题编号"
      },
      // 密保答案
      user_security_answer: {
        type: DataTypes.STRING(32),
        allowNull: false,
        comment: "密保答案"
      },
      // 博客称呼
      user_blog_title: {
        type: DataTypes.STRING(16),
        allowNull: true,
        comment: "博客称呼"
      },
      // 博客简介
      user_blog_introduction: {
        type: DataTypes.STRING(32),
        allowNull: true,
        comment: "博客简介"
      },
      // 博客积分
      user_mark: {
        type: DataTypes.INTEGER(8),
        allowNull: false,
        defaultValue: 0,
        comment: "博客积分"
      },
      // 博客等级
      user_rank: {
        type: DataTypes.TINYINT(3),
        allowNull: false,
        defaultValue: 1,
        comment: "博客等级"
      },
      // 用户访问量
      user_view: {
        type: DataTypes.INTEGER(8),
        allowNull: false,
        defaultValue: 0,
        comment: "用户访问量"
      },
      // 用户头像地址
      user_image_url: {
        type: DataTypes.STRING(320),
        allowNull: true,
        comment: "用户头像地址"
      },
      // 用户头像选择
      user_image_type: {
        type: DataTypes.TINYINT(3),
        allowNull: false,
        comment: "用户头像选择"
      },
      // 用户注册IP
      user_register_ip: {
        type: DataTypes.CHAR(16),
        allowNull: false,
        comment: "用户注册IP"
      },
      // 用户最后登录IP
      user_last_login_ip: {
        type: DataTypes.CHAR(16),
        allowNull: true,
        comment: "用户最后登录IP"
      },
      // 用户状态: 1表示在线，0离线
      user_type: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 0,
        comment: "用户状态: 1表示在线，0离线"
      },
      // 账户状态，0表示正常，1表示锁定
      user_lock: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 0,
        comment: "账户状态，0表示正常，1表示锁定"
      },
      // 是否冻结，0为不冻结，1为冻结
      user_freeze: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 1,
        comment: "是否冻结，0为不冻结，1为冻结"
      }
    }, {
      //数据库中的表明与程序中的保持一致，否则数据库中的表名会以复数的形式命名
      freezeTableName: true,
      // 定义表名
      tableName: "user",
      //表描述
      comment: "用户表"
    }
  );
  return User;
};