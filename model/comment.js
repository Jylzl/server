'use strict'
module.exports = function (sequelize, DataTypes) {
    var Comment = sequelize.define('comment', {
        // 评论编号
        comment_no: {
            type: DataTypes.INTEGER(8),
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        // 当前评论用户
        user_id: {
            type: DataTypes.INTEGER(8),
            allowNull: false,
        },
        // 评论内容
        comment_content: {
            type: DataTypes.STRING(512),
            allowNull: false
        }
    }, {
        freezeTableName: true, //数据库中的表明与程序中的保持一致，否则数据库中的表名会以复数的形式命名 
        // 定义表名
        tableName: "comment",
        // 表描述
        comment: "评论表"
    });
    return Comment;
};