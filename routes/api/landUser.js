const express = require("express");
const router = express.Router();
const sqldb = require('../../mysql');
const User = sqldb.User;
const md5 = require("md5");
const passport = require("passport");

// post请求 用户信息
router.post("/landuserinf", passport.authenticate("jwt", {
    session: false
}), (req, res) => {
    if (req.user) {
        res.json(JSON.stringify([{
            "msg": '1'
        }, req.user]))
    } else {
        res.json(JSON.stringify([{
            "msg": 'error'
        }]))
    }
});
//密码验证-post
router.post("/checkpassword", (req, res) => {
    User.findOne({
        attributes: ['user_id', 'user_name', 'user_type', 'user_image_url', 'user_image_type', 'user_blog_title', 'user_blog_introduction'],
        where: {
            user_pwd: md5(req.body.pswd),
            user_id: req.body.userId
        }
    }).then((result) => {
        //0表示 密码错误或者用户名不存在
        //1表示 验证成功
        var send;
        if (result) {
            send = 1;
        } else {
            send = 0;
        }
        res.json(JSON.stringify([{
            "msg": send
        }]))
    }).catch((err) => {
        console.log("发生错误：" + err);
    });
});
// 密码-修改
router.post("/updatepassword", (req, res) => {
    const pswd = {
        user_id: req.body.userId,
        user_pwd: md5(req.body.newPswd)
    };
    sqldb.sequelize.transaction((t) => {
        return User.update(pswd, {
                where: {
                    user_id: req.body.userId,
                    user_pwd: md5(req.body.oldPswd)
                },
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
                console.log("发生错误q：" + err);
            });
    });
});

// 信息-修改
router.post("/updateuserinf", (req, res) => {
    const inf = {
        user_id: req.body.userId,
        user_blog_title: req.body.blogtitle,
        user_blog_introduction: req.body.introduction,
        user_github: req.body.github
    };
    User.update(inf, {
            where: {
                user_id: req.body.userId
            }
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
module.exports = router;