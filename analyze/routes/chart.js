const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const SaleModel = require('../proxy/sales');
const PlaceModel = require('../proxy/places');
const dataTreating = require('../tools/dataTreating');
const checkLogin = require('../bin/check').checkLogin;

//GET /chart 图表页
router.get('/',checkLogin , function (req, res, next) {
    const area = req.session.user.area;
    const areaid= [];
    area.forEach(function (docs) {
        areaid.push(ObjectId(docs._id))
    });
    Promise.all([
        SaleModel.getMonthAreaSale(areaid),
        SaleModel.getAreaLossSum(areaid),
        SaleModel.getSalerSort(areaid),
        SaleModel.getLossSort(areaid)
    ]).then(function (result) {
        const lineData = dataTreating.lineData(area,result[0]);
        const shadowData = dataTreating.shadowData(area,result[1]);
        const saleTable = dataTreating.tablelData(area, result[2]);
        const lossTable = dataTreating.tablelData(area, result[3]);
        res.render('chart', {
            areas: area,
            lineData: lineData,
            shadowData: shadowData,
            saleTable: saleTable,
            lossTable: lossTable
        })
    })
        .catch(next)
});

//GET /chart/place?areaId = xxx 查看区域内所有点
router.get('/place',checkLogin,function (req, res, next) {
    const areaId = req.query.areaId;
    const area = req.session.user.area;
    PlaceModel.getPlaceAreaid(areaId).then(function (docs) {
        if (!docs) throw new Error('该区没有放置点');
        res.render('place', {
            places:docs,
            areas: area,
            areaId:areaId
        })
    })
        .catch(next)
});

module.exports = router;