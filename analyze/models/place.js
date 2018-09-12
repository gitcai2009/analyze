const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const UserPlace = new Schema({
    name:{ type: 'string', required: true},//放置点名称
    coord:{ type: 'array', required: true},//坐标
    arrears:{ type: Number,default: 0},//欠款
    comment:{ type: 'string', required: true},//备注
    author: { type: Schema.Types.ObjectId, ref: 'user'},
    areaId: { type: Schema.Types.ObjectId}
});

UserPlace.index({ areaId:1,arrears:1});

mongoose.model('place', UserPlace, 'place');