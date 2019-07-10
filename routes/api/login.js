const express = require("express");
const router = express.Router();
const sqldb = require('../../mysql');
const User = sqldb.User;
const md5 = require("md5")
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys")

//登陆接口
router.post("/login", (req, res) => {
    const landIp = req.headers['x-real-ip'] ? req.headers['x-real-ip'] : req.ip.replace(/::ffff:/, '');
    User.findOne({
        attributes: ['user_id', 'user_name', 'user_email', "user_phone", 'user_type', 'user_image_url', 'user_image_type', 'user_blog_title', 'user_blog_introduction'],
        where: {
            user_pwd: md5(req.body.pass),
            $or: [{
                user_id: req.body.user
            }, {
                user_name: req.body.user
            }, {
                user_phone: req.body.user
            }, {
                user_email: req.body.user
            }]
        }
    }).then((result) => {
        //0表示 密码错误或者用户名不存在
        //1表示 验证成功
        //2表示 用户已经登陆
        var send;
        if (result) {
            const userType = result.dataValues.user_type;
            if (userType === 0 || userType === 1) {
                send = 1;
                User.update({
                    user_last_login_ip: landIp,
                    user_type: 1
                }, {
                    where: {
                        user_id: result.dataValues.user_id
                    }
                }).then((result) => {}).catch((err) => {
                    console.log("发生错误：" + err);
                });

                const rule = {
                    userId: result.user_id,
                    userEmail: result.user_email
                }
                jwt.sign(rule, keys.secretOrKey, {
                    // token过期时间，24小时，以秒为单位
                    expiresIn: 86400
                }, (err, token) => {
                    if (err) {
                        console.log(err)
                    } else {
                        var tokens = "Bearer " + token;
                        res.cookie('user_id', result.user_id);
                        res.cookie('token', tokens);
                        res.json(JSON.stringify([{
                            "msg": 1,
                            "token": tokens
                        }, result]))
                    }
                })
            } else if (userType === 1) {
                res.json(JSON.stringify([{
                    "msg": 2
                }]))
            }
        } else {
            res.json(JSON.stringify([{
                "msg": 0
            }]))
        }

    }).catch((err) => {
        console.log("发生错误：" + err);
    });
});
//退出登陆
router.post("/loginout", (req, res) => {
    const landIp = req.headers['x-real-ip'] ? req.headers['x-real-ip'] : req.ip.replace(/::ffff:/, '');
    const user = {
        user_type: 0,
        user_last_login_ip: landIp
    };
    sqldb.sequelize.transaction((t) => {
        return User.update(user, {
                where: {
                    user_id: req.body.userId
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
module.exports = router;