'use strict'
module.exports = function (sequelize, DataTypes) {
    var Reply = sequelize.define('reply', {
        // 回复编号
        reply_no: {
            type: DataTypes.INTEGER(8),
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        // 该回复用户ID
        user_id: {
            type: DataTypes.INTEGER(8),
            allowNull: false,
        },
        // 该回复对应评论编号
        comment_no: {
            type: DataTypes.INTEGER(8),
            allowNull: false,
        },
        // 回复内容
        reply_content: {
            type: DataTypes.STRING(512),
            allowNull: false
        }
    }, {
        freezeTableName: true, //数据库中的表明与程序中的保持一致，否则数据库中的表名会以复数的形式命名 
        // 定义表名
        tableName: "reply",
        // 表描述
        comment: "回复表"
    });
    return Reply;
};