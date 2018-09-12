const models = require('../models/mongo');
const User = models.User;

module.exports = {
    //注册账号
    create: function create(user) {
        return User.create(user);
    },
    //获取用户信息
    getUser: function getUser(name) {
        return User.findOne({ name: name }).exec()
    },

    addArea: function addArea(name,areaname) {
        return User.updateOne({name:name},{$addToSet:{area:{areaname:areaname}}}).exec()
    },

    deleteArea: function deleteArea(name,areaid) {
        return User.updateOne({name:name},{$pull:{area:{_id:areaid}}}).exec()
    }
};