const fs = require("fs");
const uuid = require('node-uuid');
const path = require("path"); /*nodejs自带的模块*/
const express = require("express");
const multer = require("multer");
const moment = require('moment');
const router = express.Router();

moment.locale('zh-cn');
const _today = moment();
const uid = uuid.v1();

const myCustomStorage = require("../../tools/upload");

//文件上传目录
// const baseUrl = process.cwd() + '\/' + 'u\/'; //绝对路径
const baseUrl = "u\/" + _today.format('YYYYMM') + '\/'; //相对路径

mkdirsSync(baseUrl);

var storage = myCustomStorage({
    destination: function (req, file, cb) {
        cb(
            null,
            baseUrl +
            uid.replace(/\-/g, '') +
            path.extname(file.originalname)
        );
    }
});

var upload = multer({
    storage: storage
});

// 用户头像上传
router.post("/headImage", upload.single("userimg"), function (req, res, next) {
    const ip = req.headers['x-real-ip'] ? req.headers['x-real-ip'] : req.ip.replace(/::ffff:/, '');
    const port = process.env.port || 5000;
    const ipPort = 'http:\/\/' + ip + ':' + port;
    req.file.path = ipPort + '/' + req.file.path;
    res.send(req.file);
});

module.exports = router;

function mkdirsSync(dirpath, mode) {
    try {
        if (!fs.existsSync(dirpath)) {
            let pathtmp;
            dirpath.split(/[/\\]/).forEach(function (dirname) { //这里指用/ 或\ 都可以分隔目录  如  linux的/usr/local/services   和windows的 d:\temp\aaaa
                if (pathtmp) {
                    pathtmp = path.join(pathtmp, dirname);
                } else {
                    pathtmp = dirname;
                }
                if (!fs.existsSync(pathtmp)) {
                    if (!fs.mkdirSync(pathtmp, mode)) {
                        return false;
                    }
                }
            });
        }
        return true;
    } catch (e) {
        log.error("create director fail! path=" + dirpath + " errorMsg:" + e);
        return false;
    }
}