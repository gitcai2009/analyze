const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const UserModel = require('../proxy/users');
const PlaceModel = require('../proxy/places');
const SaleModel = require('../proxy/sales');
const MachineModel = require('../proxy/machines');
const dataTreating = require('../tools/dataTreating');
const checkLogin = require('../bin/check').checkLogin;


//GET /place 所有点或特定区域点的地图
//GET /place? areaId = xxx
router.get('/',checkLogin,function (req, res, next) {
    const author = req.session.user._id;
    const area = req.session.user.area;
    const areaId = req.query.areaId;
    const areaid= [];
    area.forEach(function (docs) {
        areaid.push(ObjectId(docs._id))
    });
    Promise.all([
        PlaceModel.getCoordByid(author),//用户所有坐标
        SaleModel.getAreaLossSum(areaid),//所有区坏账排序
        MachineModel.getCount(author),
        MachineModel.getNoCount(author)
    ]).then(function (result) {
        const places = dataTreating.placeAnalyse(result[0],areaId);
        const dates = dataTreating.newtip1(areaId,dataTreating.shadowData(area,result[1]));
        let machines = null;
        if (!areaId){
            machines = [result[2],result[3]];
        }
        res.render('plat', {
            areas: area,
            places: places,
            dates: dates,
            machines:machines
        })
    })
        .catch(next)
});

//POST /place? areaId = xxx 添加area
router.post('/',checkLogin, function (req, res, next) {
    const area = req.session.user.area;
    const areaname = req.fields.areaname;
    const name = req.session.user.name;
    try {
        if (!areaname.length) throw new Error('请填写区域名称');
        area.forEach(function (item) {
            if (item.areaname == areaname) throw new Error('区域名被占用');
        });
    }catch (e){
        req.flash('error', e.message);
        return res.redirect('back')
    }

    UserModel.addArea(name, areaname).then(function () {
        UserModel.getUser(name).then(function (docs) {
            req.session.user.area = docs.area;
            req.session.save();
        });
        req.flash('success', '创建区域成功');
        res.redirect('back')
    }).catch(function (e) {
        if (e.message.match('duplicate key')){
            req.flash('error', '创建失败');
            res.redirect('back')
        }
        next(e)
    })
});

module.exports = router;