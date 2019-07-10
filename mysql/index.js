'use strict'

const config = require('../config/mysql.config.js');
const Sequelize = require('sequelize');
const db = {
    sequelize: new Sequelize(config.database, config.username, config.password, config)
};

// 用户表
var User = db.sequelize.import('../model/user.js');
// 文章表
var Article = db.sequelize.import('../model/article.js');
// 分类表
var Classify = db.sequelize.import('../model/classify.js');
// 评论表
var Comment = db.sequelize.import('../model/comment.js');
// 回复表
var Reply = db.sequelize.import('../model/reply.js');
// 安全表
var Security = db.sequelize.import('../model/security.js');

db.User = User;
db.Article = Article;
db.Classify = Classify;
db.Comment = Comment;
db.Reply = Reply;
db.Security = Security;

User.hasMany(Article, {
    as: 'UserArticle',
    constraints: true, //是否在删除或更新时启用外键约束
    foreignKey: 'user_id'
});
User.hasMany(Classify, {
    as: 'UserClassify',
    foreignKey: 'user_id'
});
Article.belongsTo(Classify, {
    as: 'ClassifyArticle',
    foreignKey: 'article_classify_no'
});
Classify.hasMany(Article, {
    as: 'ArticleClassify',
    foreignKey: 'article_classify_no'
});
Article.hasMany(Comment, {
    as: 'ArticleComment',
    foreignKey: 'article_no'
});
Comment.hasMany(Reply, {
    as: 'CommentReply',
    foreignKey: 'comment_no'
})
Comment.belongsTo(User, {
    as: 'UserComment',
    foreignKey: 'user_id'
});
Reply.belongsTo(User, {
    as: 'UserReply',
    foreignKey: 'user_id'
});
module.exports = db;