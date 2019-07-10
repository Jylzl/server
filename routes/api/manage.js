const express = require("express");
const router = express.Router();
const sqldb = require("../../mysql");
const User = sqldb.User;
const Article = sqldb.Article;
const Classify = sqldb.Classify;
const Comment = sqldb.Comment;

//写文章
router.post("/write", (req, res) => {
    const article = {
        user_id: req.body.userId,
        article_title: req.body.title,
        article_content: req.body.content,
        article_html: req.body.html,
        article_summary: req.body.summary,
        article_classify_no: req.body.classify,
        article_label: req.body.labels.toString(),
        article_type: req.body.type,
        article_view: req.body.only_self_view,
        article_top: req.body.is_top,
        article_is_comment: req.body.is_comment
    };

    Article.create(article)
        .then((result) => {
            if (result.dataValues) {
                res.json(
                    JSON.stringify([{
                            msg: 1
                        },
                        {
                            article_no: result.dataValues.article_no
                        }
                    ])
                );
            } else {
                res.json(
                    JSON.stringify([{
                        msg: 0
                    }])
                );
            }
        })
        .catch((err) => {
            console.log("发生错误：" + err);
        });
});

// 用户博客列表
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
            attributes: [
                "article_no",
                "user_id",
                "article_title",
                "article_summary",
                "article_classify_no",
                "article_label",
                "article_type",
                "article_view",
                "article_is_comment",
                "article_read",
                "article_top",
                "createdAt"
            ],
            where: {
                user_id: req.query.userid,
                $or: [{
                        article_title: {
                            $like: "%" + req.query.search + "%"
                        }
                    },
                    {
                        article_content: {
                            $like: "%" + req.query.search + "%"
                        }
                    },
                    {
                        article_summary: {
                            $like: "%" + req.query.search + "%"
                        }
                    },
                    {
                        article_label: {
                            $like: "%" + req.query.search + "%"
                        }
                    }
                ],
                article_classify_no: req.query.classify ?
                    req.query.classify : {
                        $gt: 0
                    },
                createdAt: {
                    $between: [req.query.time[0], req.query.time[1]]
                }

            },
            limit: Number(req.query.size),
            offset: (req.query.pageno - 1) * req.query.size,
            order: [
                [req.query.prop, req.query.order]
            ]
        })
        .then((result) => {
            var msg;
            var total = result.count;
            var list = [];
            if (total) {
                msg = 1;
                list = result.rows;
            } else {
                msg = 0;
            }
            res.json(
                JSON.stringify([{
                        msg: msg
                    },
                    {
                        total: total
                    },
                    {
                        list: list
                    }
                ])
            );
        })
        .catch((err) => {
            console.log("发生错误：" + err);
        });
});
// 分类管理-删除
router.delete("/delarticle", (req, res) => {
    sqldb.sequelize.transaction((t) => {
        return Article.destroy({
                where: {
                    user_id: req.query.userid,
                    article_no: req.query.articleno
                }
            }, {
                transaction: t
            })
            .then((result) => {
                var msg;
                if (result) {
                    msg = 1;
                } else {
                    msg = 0;
                }
                res.json(
                    JSON.stringify([{
                        msg: msg
                    }])
                );
            })
            .catch((err) => {
                console.log("发生错误：" + err);
            });
    });
});
// 分类管理-获取
router.get("/getclassify", (req, res) => {
    Classify.findAndCountAll({
            include: [{
                model: Article,
                as: 'ArticleClassify',
                attributes: ['article_no']
            }],
            distinct: true,
            attributes: ['classify_no', 'classify_name'],
            where: {
                user_id: req.query.userId
            },
            limit: Number(req.query.size),
            offset: (req.query.pageno - 1) * req.query.size
        })
        .then((result) => {
            var msg;
            if (result) {
                msg = 1;
            } else {
                msg = 0;
            }
            res.json(
                JSON.stringify([{
                    msg: msg
                }, result])
            );
        })
        .catch((err) => {
            console.log("发生错误：" + err);
        });
});

// 分类管理-添加
router.post("/addclassify", (req, res) => {
    const classify = {
        user_id: req.body.userId,
        classify_name: req.body.classifyName
    };
    Classify.create(classify)
        .then((result) => {
            var msg;
            if (result.dataValues) {
                msg = 1;
            } else {
                msg = 0;
            }
            res.json(
                JSON.stringify([{
                    msg: msg
                }])
            );
        })
        .catch((err) => {
            console.log("发生错误：" + err);
        });
});

// 分类管理-删除
router.delete("/delclassify", (req, res) => {
    sqldb.sequelize.transaction((t) => {
        return Classify.destroy({
                where: {
                    classify_no: req.query.no
                }
            }, {
                transaction: t
            })
            .then((result) => {
                var msg;
                if (result) {
                    msg = 1;
                } else {
                    msg = 0;
                }
                res.json(
                    JSON.stringify([{
                        msg: msg
                    }])
                );
            })
            .catch((err) => {
                console.log("发生错误：" + err);
            });
    });
});

// 分类管理-修改
router.post("/updateclassify", (req, res) => {
    const classify = {
        user_id: req.body.userId,
        classify_no: req.body.no,
        classify_name: req.body.name
    };
    Classify.upsert(classify)
        .then((result) => {
            var msg;
            if (result == false) {
                msg = 1;
            } else if (result == true) {
                msg = 2;
            } else {
                msg = 0;
            }
            res.json(
                JSON.stringify([{
                    msg: msg
                }])
            );
        })
        .catch((err) => {
            console.log("发生错误：" + err);
        });
});
module.exports = router;