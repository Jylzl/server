'use strict'
module.exports = function (sequelize, DataTypes) {
    var Article = sequelize.define('article', {
        // 文章编号
        article_no: {
            type: DataTypes.INTEGER(8),
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            comment: '文章编号'
        },
        // 文章标题
        article_title: {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        // 文章内容
        article_content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        // 文章内容，带HTML标签
        article_html: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        // 文章摘要
        article_summary: {
            type: DataTypes.STRING(256),
            allowNull: false
        },
        // 文章自定义标签
        article_label: {
            type: DataTypes.STRING(64),
            allowNull: true
        },
        // 文章阅读量
        article_read: {
            type: DataTypes.INTEGER(8),
            allowNull: false,
            defaultValue: 0
        },
        // 文章评论数量
        article_type: {
            type: DataTypes.INTEGER(1),
            allowNull: false,
            defaultValue: 0
        },
        // 文章显示，0公开，1私有
        article_view: {
            type: DataTypes.BOOLEAN(1),
            allowNull: false,
            defaultValue: 0
        },
        // 文章置顶，0普通，1置顶
        article_top: {
            type: DataTypes.BOOLEAN(1),
            allowNull: false,
            defaultValue: 0
        },
        // 文章是否可以评论，0不能，1可以
        article_is_comment: {
            type: DataTypes.BOOLEAN(1),
            allowNull: false,
            defaultValue: 1
        }
    }, {
        freezeTableName: true, //数据库中的表明与程序中的保持一致，否则数据库中的表名会以复数的形式命名 
        // 定义表名
        tableName: "article",
        // 表描述
        comment: "文章表"
    });
    return Article;
};