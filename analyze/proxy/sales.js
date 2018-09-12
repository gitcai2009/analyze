const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const models = require('../models/mongo');
const Sale = models.Sale;

module.exports = {
    create: function create(sale) {
        return Sale.create(sale)
    },


    //各区收入
    getAreaSaleSum: function getAreaSaleSum(areaId) {
        return Sale.aggregate([
            { $match:{areaId:{$in:areaId}}},
            { $project:{ "year":{$year:"$date"},saleroom:1,areaId:1}},
            { $match: { "year": (new Date()).getFullYear()}},
            { $group: { _id: "$areaId", saleSum:{ $sum: "$saleroom"}}},
            { $sort:{_id:1}}
        ]).exec()
    },

    // 各区坏账
    getAreaLossSum: function getAreaLossSum(areaId) {
        return Sale.aggregate([
            { $match:{areaId:{$in:areaId}}},
            { $project:{ "year":{$year:"$date"},saleroom:1,gift:1,loss:1,areaId:1}},
            { $match: { "year": (new Date()).getFullYear()}},
            { $group: { _id: "$areaId", saleSum:{ $sum: "$saleroom"},lossSum:{$sum:'$loss'},giftSum:{$sum:'$gift'}}},
            { $sort:{_id:1}}
        ]).exec()
    },

    // 各区域每月收入情况
    getMonthAreaSale: function getMonthAreaSale(areaId) {
        return Sale.aggregate([
            { $match:{areaId:{$in:areaId}}},
            { $project:{ "year":{$year:"$date"},date:1,saleroom:1,areaId:1}},
            { $match: { "year": (new Date()).getFullYear()}},
            { $group: { _id: {month:{"$month": "$date"},areaId:"$areaId"}, monthAreaSale:{ $sum: "$saleroom"}}},
            { $sort:{_id:1}}
        ]).exec()
    },


    //放置点总收入前20名
    getSalerSort: function getSalerSort(areaId) {
        return Sale.aggregate([
            { $match:{areaId:{$in:areaId}}},
            {$lookup:{
                from: "place",
                localField: "placeId",
                foreignField: "_id",
                as: "place"
            }},
            { $project:{ "year":{$year:"$date"},"name":'$place.name',saleroom:1,placeId:1,areaId:1}},
            { $match: { "year": (new Date()).getFullYear()}},
            { $group: { _id:{ name:"$name",areaId:"$areaId" }, Sum:{ $sum: "$saleroom"}}},
            { $sort:{ Sum:-1 }},
            { $limit: 20 }
        ]).exec()
    },

    //放置点总坏账前20名
    getLossSort: function getLossSort(areaId) {
        return Sale.aggregate([
            { $match:{areaId:{$in:areaId}}},
            {$lookup:{
                from: "place",
                localField: "placeId",
                foreignField: "_id",
                as: "place"
            }},
            { $project:{ "year":{$year:"$date"},"name":'$place.name',loss:1,placeId:1,areaId:1}},
            { $match: { "year": (new Date()).getFullYear()}},
            { $group: {_id:{ name:"$name", areaId:"$areaId" }, Sum:{ $sum: "$loss"}}},
            { $sort:{ Sum:-1 }},
            { $limit: 20 }
        ]).exec()
    },

    //放置点各机器收入
    getMachineSale: function getMachineSale(placeId) {
        return Sale.aggregate([
            {$match:{placeId:ObjectId(placeId)}},
            {$lookup:{
                from: "machine",
                localField: "machineId",
                foreignField: "_id",
                as: "ma"
            }},
            {$project:{saleroom:1,"name":'$ma.name',"index":'$ma.machineNo'}},
            {$group:{_id:{index:"$index",name:"$name"}, sum:{$sum:"$saleroom"}}},
            { $sort:{ Sum:-1 }}
        ]).exec()
    },

    //place每天收入
    getPlaceDateSum: function getPlaceDateSum(placeId) {
        return Sale.aggregate([
            { $match:{placeId:ObjectId(placeId)}},
            { $project:{ "date":{$dateToString:{format:"%Y-%m-%d",date:"$date"}},saleroom:1}},
            { $group: { _id: "$date", saleSum:{ $sum: "$saleroom"}}},
            { $sort:{_id:1}}
        ]).exec()
    }

};