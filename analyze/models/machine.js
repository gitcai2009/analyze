const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const UserMachine = new Schema({
    name:{ type: 'string', required: true},//机器名称
    machineNo:{ type: 'string',unique: true, required: true},//机器编号
    initialNo:{ type: Number, default: 0},//记录金额
    author: { type: Schema.Types.ObjectId, ref: 'user'},
    placeId: { type: Schema.Types.ObjectId, ref: 'place'}
});

UserMachine.index({ author:1});

mongoose.model('machine', UserMachine, 'machine');