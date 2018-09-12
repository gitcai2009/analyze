const express = require('express');
const router = express.Router();

const PlaceModel = require('../proxy/places');
const SaleModel = require('../proxy/sales');
const MachineModel = require('../proxy/machines');
const checkLogin = require('../bin/check').checkLogin;


//GET /place/:areaId/place-details? placeId = xxx   查看点详情
router.get('/:areaId/place-details',checkLogin,function (req, res, next) {
    const area = req.session.user.area;
    const placeId = req.query.placeId;
    Promise.all([
        PlaceModel.getPlaceById(placeId),
        MachineModel.getMachineByPlaceid(placeId),
        SaleModel.getMachineSale(placeId),
        SaleModel.getPlaceDateSum(placeId)
    ]).then(function (result) {
        res.render('place_details', {
            areas: area,
            places:result[0],
            machines: result[1],
            historySales:result[2],
            dateSale:result[3]
        })
    })
        .catch(next)
});

//POST /place/:areaId/place-details? placeId = xxx    添加收入
router.post('/:areaId/place-details',checkLogin,function (req, res, next) {
    const areaId = req.params.areaId;
    const placeId = req.query.placeId;
    const machineId = req.fields.machineId;
    const oidInitial = req.fields.oidInitial;
    const initial = req.fields.initial;
    const loss = req.fields.loss;
    const gift = req.fields.gift;
    const count = initial - oidInitial;

    try {
        if (!placeId.length) throw new Error('不正常路径');
        if (!machineId.length) throw new Error('发生未知错误，请刷新后操作');
        if (!oidInitial.length) throw new Error('发生未知错误，请刷新后操作');
        if (!initial.length) throw new Error('请填写记录数额');
        if (initial < oidInitial) throw new Error('新数值不能比记录数值小');
        if (!loss.length) throw new Error('请填写损耗金额');
        if (!gift.length) throw new Error('请填写礼品金额');
    }catch (e){
        req.flash('error', e.message);
        return res.redirect('back')
    }

    const saleDate = {
        saleroom:count,
        loss:loss,
        gift:gift,
        machineId:machineId,
        areaId:areaId,
        placeId:placeId
    };


    SaleModel.create(saleDate).then(function () {
        MachineModel.updateMachineId(machineId,{initialNo:initial}).then(function () {
            req.flash('success', '添加收入成功');
            res.redirect('back')
        });
    }).catch(function (e) {
        if (e.message.match('duplicate key')){
            req.flash('error', '添加收入失败');
            res.redirect('back')
        }
        next(e)
    });
});

//GET  GET /place/:placeId/remove 删除点
router.get('/:placeId/remove',checkLogin,function (req, res, next) {
    const placeId = req.params.placeId;
    MachineModel.getMachineByPlaceid(placeId).then(function (docs) {
        if (!docs){
            req.flash('error', '请回收该店所有机器后再删除');
            return res.redirect('back')
        }

        PlaceModel.deleteOnePlace(placeId).then(function () {
            req.flash('success','删除成功');
            return res.redirect('/chart');
        }).catch(function (e) {
            if (e.message.match('duplicate key')){
                req.flash('error', '删除失败');
                res.redirect('back')
            }
            next(e)
        })
    })
        .catch(next);
});

//POST /place/:placeId/edit-arrears 修改欠款
router.post('/:placeId/edit-arrears',checkLogin, function (req, res, next) {
    const placeId = req.params.placeId;
    const arrears = req.fields.arrears;
    let date = {arrears:arrears};
    PlaceModel.updataPlace(placeId,date).then(function () {
        req.flash('success', '修改欠款成功');
        res.redirect('back');
    }).catch(function (e) {
        if (e){
            req.flash('error', '修改欠款失败');
            res.redirect('back')
        }
        next(e)
    });
});

//POST /place/:placeId/edit-comment 修改备注
router.post('/:placeId/edit-comment',checkLogin, function (req, res, next) {
    const placeId = req.params.placeId;
    const comment = req.fields.comment;
    let date = {comment:comment};
    PlaceModel.updataPlace(placeId,date).then(function () {
        req.flash('success', '修改备注成功');
        res.redirect('back');
    }).catch(function (e) {
        if (e){
            req.flash('error', '修改备注失败');
            res.redirect('back')
        }
        next(e)
    });
});

//GET /place/:placeId/recycle-machine 回收机器
router.get('/:placeId/recycle-machine',checkLogin,function (req, res, next) {
    const maNo = req.query.machineNo;
    MachineModel.updateMachine(maNo,{placeId:null}).then(function () {
        req.flash('success', '回收成功');
        res.redirect('back');
    })
        .catch(next)
});

//GET /place/:placeId/put-machine 摆放机器
router.get('/:placeId/put-machine',checkLogin,function (req, res, next) {
    const maNo = req.query.machineNo;
    const placeId = req.params.placeId;

    try {
        if (!maNo.length) throw new Error('请填写机器编号');
    }catch(e){
        req.flash('error',e.message);
        return res.redirect('back')
    }

    MachineModel.getMachine(maNo).then(function (docs) {
        if(!docs){
            req.flash('error','库存没有这个机器编号');
            return res.redirect('back')
        }
        if (docs.placeId != null){
            req.flash('error', '这个机器已在其它地方摆放');
            return res.redirect('back')
        }
        MachineModel.updateMachine(maNo,{placeId:placeId}).then(function () {
            req.flash('success','放置成功');
            res.redirect('back')
        })
    })
        .catch(next);
});

module.exports = router;