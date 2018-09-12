const models = require('../models/mongo');
const Machine = models.Machine;

module.exports = {
    create: function create(date) {
        return Machine.create(date);
    },

    getMachine: function getMachine(maNo) {
        return Machine.findOne({machineNo:maNo}).exec();
    },

    getMachineByPlaceid: function getMachine(placeId) {
        return Machine.find({placeId: placeId}).exec();
    },

    getMachineByAuthor: function getCount(author) {
        return Machine.find({author: author}).exec()
    },

    getCount: function getCount(author) {
        return Machine.count({author: author}).exec()
    },

    getNoCount: function getNoCount(author) {
        return Machine.count({author: author,placeId:{$ne:null}}).exec()
    },

    updateMachine: function updateMachine(maNo,date) {
        return Machine.updateOne({machineNo:maNo},{$set:date}).exec()
    },
    updateMachineId: function updateMachine(id,date) {
        return Machine.updateOne({_id:id},{$set:date}).exec()
    },

    deleteMachine: function deleteMachine(machineNo) {
        return Machine.deleteOne({machineNo: machineNo}).exec()
    }
};