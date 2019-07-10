const express = require("express");
const router = express.Router();
const sqldb = require('../../mysql');
const User = sqldb.User;
const Article = sqldb.Article;
const Classify = sqldb.Classify;
const Comment = sqldb.Comment;
const Reply = sqldb.Reply;
const md5 = require("md5")

// get请求 用户信息
router.get("/userinf", (req, res) => {
    User.findById(req.query.userid, {
        attributes: ['user_id', 'user_name', 'user_email', 'user_phone', 'user_qq', 'user_github', 'user_type', 'user_image_url', 'user_image_type', 'user_blog_title', 'user_blog_introduction', 'user_mark', 'user_rank', 'user_view', 'user_lock'],
    }).then((result) => {
        var msg;
        if (result) {
            msg = 1;
            // 用户访问量(访问一次+1)
            User.increment({
                'user_view': 1
            }, {
                where: {
                    user_id: Number(req.query.userid)
                }
            }).then((result) => {})
        } else {
            msg = 0;
        }
        res.json(JSON.stringify([{
            "msg": msg
        }, result]))
    }).catch((err) => {
        console.log("用户信息接口_错误：" + err);
    });
});
// get请求 用户博客列表
router.get("/list", (req, res) => {
    Article.findAndCountAll({
        include: [{
                model: Classify,
                as: 'ClassifyArticle',
                attributes: ['classify_no', 'classify_name']
            },
            {
                model: Comment,
                as: 'ArticleComment',
                attributes: ['comment_no']
            }
        ],
        distinct: true,
        attributes: ['article_no', 'user_id', 'article_title', 'article_summary', 'article_classify_no', 'article_type', 'article_read', 'article_top', 'createdAt'],
        where: {
            user_id: req.query.userid,
            $or: [{
                article_title: {
                    $like: '%' + req.query.search + '%'
                }
            }, {
                article_content: {
                    $like: '%' + req.query.search + '%'
                }
            }, {
                article_summary: {
                    $like: '%' + req.query.search + '%'
                }
            }, {
                article_label: {
                    $like: '%' + req.query.search + '%'
                }
            }],
            article_classify_no: req.query.classify ? req.query.classify : {
                $gt: 0
            }
        },
        limit: Number(req.query.size),
        offset: (req.query.pageno - 1) * req.query.size,
        order: [
            ['createdAt', 'DESC']
        ]
    }).then((result) => {
        var msg;
        var total = result.count;
        var list = [];
        if (total) {
            msg = 1;
            list = result.rows;
        } else {
            msg = 0;
        }
        res.json(JSON.stringify([{
            "msg": msg
        }, {
            "total": total
        }, {
            "list": list
        }]))
    }).catch((err) => {
        console.log("博客列表接口_错误：" + err);
        res.json(JSON.stringify([{
            "msg": 'error'
        }]))
    });
});
// get请求 用户博客列表最新
router.get("/recent", (req, res) => {
    Article.findAndCountAll({
        attributes: ['article_no', 'user_id', 'article_title'],
        where: {
            user_id: req.query.userid
        },
        limit: Number(req.query.size),
        offset: (req.query.pageno - 1) * req.query.size,
        order: [
            ['createdAt', 'DESC']
        ]
    }).then((result) => {
        var msg;
        var total = result.count;
        var list = [];
        if (total) {
            msg = 1;
            list = result.rows;
        } else {
            msg = 0;
        }
        res.json(JSON.stringify([{
            "msg": msg
        }, {
            "total": total
        }, {
            "list": list
        }]))
    }).catch((err) => {
        console.log("最新博客接口_错误：" + err);
    });
});
// get请求 热门博客
router.get("/hostarticle", (req, res) => {
    Article.findAndCountAll({
        attributes: ['article_no', 'user_id', 'article_title', 'article_read'],
        where: {
            user_id: req.query.userid
        },
        limit: Number(req.query.size),
        offset: (req.query.pageno - 1) * req.query.size,
        order: [
            ['article_read', 'DESC']
        ]
    }).then((result) => {
        var msg;
        var total = result.count;
        var list = [];
        if (total) {
            msg = 1;
            list = result.rows;
        } else {
            msg = 0;
        }
        res.json(JSON.stringify([{
            "msg": msg
        }, {
            "total": total
        }, {
            "list": list
        }]))
    }).catch((err) => {
        console.log("热门博客接口_错误：" + err);
    });
});
// get请求 用户博客列表最新
router.get("/classify", (req, res) => {
    Classify.findAll({
        attributes: ['classify_no', 'classify_name'],
        where: {
            user_id: req.query.userid
        }
    }).then((result) => {
        var msg;
        var classifys = [];
        if (result) {
            msg = 1;
            classifys = result;
        } else {
            msg = 0;
        }
        res.json(JSON.stringify([{
            "msg": msg
        }, {
            "classifys": classifys
        }]))
    }).catch((err) => {
        console.log("博客分类接口_错误：" + err);
    });
});
// get请求 文章
router.get("/article", (req, res) => {
    Article.findOne({
        include: [{
                model: Classify,
                as: 'ClassifyArticle',
                attributes: ['classify_no', 'classify_name']
            },
            {
                model: Comment,
                as: 'ArticleComment',
                attributes: ['comment_no', 'comment_content', 'user_id', 'createdAt'],
                include: [{
                        model: Reply,
                        as: 'CommentReply',
                        attributes: ['reply_no', 'reply_content', 'user_id', 'createdAt'],
                        include: [{
                            model: User,
                            as: 'UserReply',
                            attributes: ['user_id', 'user_name', 'user_image_url']
                        }]
                    },
                    {
                        model: User,
                        as: 'UserComment',
                        attributes: ['user_id', 'user_name', 'user_image_url']
                    }
                ]
            }
        ],
        attributes: ['user_id', 'article_no', 'article_title', 'article_html', 'article_classify_no', 'article_label', 'article_type', 'article_read', 'createdAt'],
        where: {
            article_no: Number(req.query.articleno),
            user_id: Number(req.query.userid)
        }
    }).then((result) => {
        var send;
        if (result) {
            send = 1;
        } else {
            send = 0;
        }
        res.json(JSON.stringify([{
            "msg": send
        }, result]))
        // 文章访问记录(访问一次+1)
        Article.increment({
            'article_read': 1
        }, {
            where: {
                article_no: Number(req.query.articleno)
            }
        }).then((result) => {})

    }).catch((err) => {
        console.log("文章接口_错误：" + err);
        res.json(JSON.stringify([{
            "msg": 'error'
        }]))
    });
});
// get请求分类统计
router.get("/classifycount", (req, res) => {
    Classify.findAndCountAll({
        include: [{
            model: Article,
            as: 'ArticleClassify',
            attributes: ['article_no'],
            where: {
                'user_id': req.query.userid
            }
        }],
        distinct: true,
        attributes: ['classify_no', 'classify_name'],
        where: {
            user_id: req.query.userid
        }
    }).then((result) => {
        var send;
        if (result) {
            send = 1;
        } else {
            send = 0;
        }
        res.json(JSON.stringify([{
            "msg": send
        }, result]))
    }).catch((err) => {
        console.log("发生错误：" + err);
    });
});
module.exports = router;