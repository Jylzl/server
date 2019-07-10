const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const keys = require("../config/keys");
const sqldb = require('../mysql');
const User = sqldb.User;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;
module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, next) => {
        User.findById(jwt_payload.userId, {
            attributes: ['user_id', 'user_name', 'user_email', "user_phone", 'user_type', 'user_image_url', 'user_image_type', 'user_blog_title', 'user_blog_introduction', "user_qq", "user_github", 'user_mark', 'user_rank', 'user_lock', 'user_last_login_ip']
        }).then((result) => {
            if (result.user_id) {
                return next(null, result);
            } else {
                return next(null, false);
            }
        }).catch((err) => console.log("登陆用户信息：" + err));
    }));
}