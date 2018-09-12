const express = require('express');
const router = express.Router();

const checkLogin = require('../bin/check').checkLogin;

router.get('/',checkLogin,function (req, res, next) {
    req.session.user = null;
    req.flash('success', '退出登录');
    res.redirect('/signin')
});
module.exports = router;