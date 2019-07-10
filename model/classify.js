'use strict'
module.exports = function (sequelize, DataTypes) {
    var Classify = sequelize.define('classify', {
        // 分类编号
        classify_no: {
            type: DataTypes.INTEGER(8),
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        // 分类名称
        classify_name: {
            type: DataTypes.STRING(16),
            allowNull: false
        }
    }, {
        freezeTableName: true, //数据库中的表明与程序中的保持一致，否则数据库中的表名会以复数的形式命名 
        // 定义表名
        tableName: "classify",
        // 表描述
        comment: "文章分类表"
    });
    return Classify;
};