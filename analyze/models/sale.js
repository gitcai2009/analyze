const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const Usersale = new Schema({
    saleroom:{type: Number, default: 0},//收入金额
    loss:{ type: Number,default: 0},//坏账金额
    gift:{ type: Number,default: 0},//礼品金额
    date:{type: Date, default: Date.now},
    machineId:{type: Schema.Types.ObjectId, ref: 'machine'},
    areaId:{type: Schema.Types.ObjectId, ref: 'user.area'},
    placeId:{type: Schema.Types.ObjectId, ref: 'place'}
});

Usersale.index({ placeId:1 , areaname:1});

mongoose.model('sale', Usersale, 'sale');