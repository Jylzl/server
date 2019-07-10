'use strict'
module.exports = function (sequelize, DataTypes) {
    var Security = sequelize.define('security', {
        // 密保编号
        security_no: {
            type: DataTypes.INTEGER(8),
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        // 密保内容
        security_content: {
            type: DataTypes.STRING(32),
            allowNull: false
        }
    }, {
        freezeTableName: true, //数据库中的表明与程序中的保持一致，否则数据库中的表名会以复数的形式命名 
        // 定义表名
        tableName: "security",
        // 表描述
        comment: "安全问题表"
    });
    return Security;
};