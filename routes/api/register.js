const express = require("express");
const router = express.Router();
const sqldb = require('../../mysql');
const User = sqldb.User;
const Security = sqldb.Security;
const md5 = require("md5")

// 获取密保问题
router.get("/security", (req, res) => {
    Security.findAll({
        attributes: ['security_no', 'security_content']
    }).then((result) => {
        var send;
        if (result.length) {
            send = 1
        } else {
            send = 0;
        }
        res.json(JSON.stringify([{
            "msg": send
        }, {
            'security': result
        }]))
    }).catch((err) => {
        console.log("密保问题" + err);
    });
});
//用户注册接口
router.post("/register", (req, res) => {
    const ip = req.headers['x-real-ip'] ? req.headers['x-real-ip'] : req.ip.replace(/::ffff:/, '');
    const user = {
        user_name: req.body.name,
        user_pwd: md5(req.body.passWord),
        user_phone: req.body.telNumber,
        user_email: req.body.email,
        user_email: req.body.email,
        user_github: req.body.github,
        security_no: req.body.question,
        user_security_answer: req.body.answer,
        user_blog_title: req.body.blogName,
        user_blog_introduction: req.body.blogTitle,
        user_image_url: req.body.imageUrl,
        user_image_type: req.body.imgType,
        user_register_ip: ip,
        user_last_login_ip: ip,
    }

    User.create(user).then((result) => {
        var user = {};
        user.id = result._previousDataValues.user_id;
        user.name = result._previousDataValues.user_name;
        user.email = result._previousDataValues.user_email;
        user.phone = result._previousDataValues.user_phone;
        user.securityNo = result._previousDataValues.security_no;
        user.securityAnswer = result._previousDataValues.user_security_answer;
        if (result.dataValues) {
            res.json(JSON.stringify([{
                "msg": 1
            }, user]))
        } else {
            res.json(JSON.stringify([{
                "msg": 0
            }]))
        }

    }).catch((err) => {
        console.log("用户注册" + err);
    });
});
// 用户名检测
router.post("/checkname", (req, res) => {
    User.findAll({
        attributes: ['user_id'],
        where: {
            user_name: req.body.name
        }
    }).then((result) => {
        var send;
        if (result.length) {
            send = 1
        } else {
            send = 0;
        }
        res.json(JSON.stringify({
            "msg": send
        }))
    }).catch((err) => {
        console.log("用户名检测" + err);
    });

});
// 邮箱检测
router.post("/checkemail", (req, res) => {
    User.findAll({
        attributes: ['user_id'],
        where: {
            user_email: req.body.email
        }
    }).then((result) => {
        var send;
        if (result.length) {
            send = 1
        } else {
            send = 0;
        }
        res.json(JSON.stringify({
            "msg": send
        }))
    }).catch((err) => {
        console.log("用户邮箱检测" + err);
    });
});
// 手机号检测
router.post("/checkphone", (req, res) => {
    User.findAll({
        attributes: ['user_id'],
        where: {
            user_phone: req.body.phone
        }
    }).then((result) => {
        var send;
        if (result.length) {
            send = 1
        } else {
            send = 0;
        }
        res.json(JSON.stringify({
            "msg": send
        }))
    }).catch((err) => {
        console.log("用户手机号检测" + err);
    });
});
module.exports = router;