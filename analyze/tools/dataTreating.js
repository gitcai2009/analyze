module.exports = {
    //tip数据处理
    newtip1: function newtip1(areaId, date) {
        const text = {};
        if (areaId){
            let id = date.id;
            let index = id.indexOf(areaId);
            text.id=date.id[index];
            text.name=date.name[index];
            text.sale=date.sale[index];
            text.loss=date.loss[index];
            text.gift=date.gift[index];
            text.profit=date.profit[index];
            return text
        }else {
            let saleSum = 0;
            (date.sale).forEach(function (item) {
                if ((typeof item != "string") && Number(item) == parseFloat(item)) {
                    saleSum += item;
                }
            });
            let lossSum = 0;
            (date.loss).forEach(function (item) {
                if ((typeof item != "string") && Number(item) == parseFloat(item)) {
                    lossSum += item;
                }
            });
            let giftSum = 0;
            (date.gift).forEach(function (item) {
                if ((typeof item != "string") && Number(item) == parseFloat(item)) {
                    giftSum += item;
                }
            });
            let proSum = 0;
            (date.profit).forEach(function (item) {
                if ((typeof item != "string") && Number(item) == parseFloat(item)) {
                    proSum += item;
                }
            });
            text.sale = saleSum;
            text.loss = lossSum;
            text.gift = giftSum;
            text.profit = proSum;
            return text
        }

    },
    newtip: function newtip(sale, loss, area, areaId) {
        let text = {};
        if (areaId){
            //对应区域名的sale
            let newsale = sale.filter(function (item) {
                return item._id == areaId;
            });
            //对应区域名loss
            let newloss = loss.filter(function (item) {
                return item._id == areaId;
            });
            if (newsale.length && newloss.length){//都有参数时
                text.sale = newsale[0].saleSum;
                text.loss = newloss[0].lossSum;
                return text
            }else if (newsale.length){//只有sale有参数时
                text.sale = newsale[0].saleSum;
                text.loss = 0;
                return text
            }else if (newloss.length){//只有loss有参数时
                text.sale = 0;
                text.loss = newloss[0].lossSum;
                return text
            }else{//都没有参数时
                text.sale = 0;
                text.loss = 0;
                return text
            }
        }else {
            var saleSum = 0;
            sale.forEach(function (item) {
                saleSum += item.saleSum;
            });
            var lossSum = 0;
            loss.forEach(function (item1) {
                lossSum += item1.lossSum;
            });
            text.sale = saleSum;
            text.loss = lossSum;
            return text
        }

    },

    lineData: function lineData(area, sale) {
        const data = [];
        for (let i=0;i<area.length;i++) {
            let monthSale = ['-','-','-','-','-','-','-','-','-','-','-','-'];
            for (let j = 0; j < sale.length; j++) {
                if ((area[i]._id) == sale[j]._id.areaId){//是否同区
                    monthSale[((sale[j]._id.month)-1)] = sale[j].monthAreaSale;
                }
            }
            const text = {name:area[i].areaname,sale:monthSale};
            data.push(text);
        }
        return data
    },

    shadowData: function shadowData(area,date) {
        let id = [],name = [],sale = [],loss = [],gift = [],profit = [];

        for (let i=0;i<area.length;i++){
            id.push(area[i]._id);
            name.push(area[i].areaname);//区域名
            sale.push('-');loss.push('-');gift.push('-');profit.push('-');
            let newdate = date.filter(function (item) {
                return item._id == area[i]._id;
            });

            if (newdate.length){
                sale[i] = newdate[0].saleSum;
                let lo = newdate[0].lossSum;
                let gi = newdate[0].giftSum;
                if (lo){
                    loss[i] = -(newdate[0].lossSum);
                }
                if (gi){
                    gift[i] = -(newdate[0].giftSum);
                }
                profit[i] = (sale[i] - lo - gi);
            }
        }


        let da = {
            id:id,
            name: name,
            sale: sale,
            loss: loss,
            gift:gift,
            profit: profit
        };

        return da
    },
    shadowData1: function shadowData(area,saleDate, lossDate) {
        let name = [];
        let sale = [];
        let loss = [];
        let profit = [];

        for (let i=0;i<area.length;i++) {
            name.push(area[i].areaname);//区域名

            let newsale = saleDate.filter(function (item) {
                return item.name == area[i].areaname;
            });
            let docs = 0;
            (newsale[0].sale).forEach(function (item) {
                //判断数组里的值是不是字符串，并且数组里的值转换成Number()数字后，和转换成浮点数后是相等的，
                if ((typeof item != "string") && Number(item) == parseFloat(item)) {
                    docs += item;
                }
            });
            sale.push(docs);//收入

            let newloss = lossDate.filter(function (item) {
                return item._id == area[i]._id;
            });
            if (!newloss.length){
                loss.push(0)
            }else{
                loss.push(-(newloss[0].lossSum));//损耗
            }

            profit.push(sale[i]+loss[i]);//利润

        }



        let dat = {
            name: name,
            sale: sale,
            loss: loss,
            profit: profit
        };

        return dat
    },

    tablelData: function tablelData(area, data) {
        const result = [];
        for (let i=0;i<data.length;i++){
            for (let y =0;y<area.length;y++){
                if ((data[i]._id.areaId)==(area[y]._id)) {//是否同区
                    const te = {
                        areaName: area[y].areaname,
                        placeName: data[i]._id.name[0],
                        value: data[i].Sum
                    };
                    result.push(te);
                }
            }
        }
        return result
    },

    placeAnalyse: function placeAnalyse(data, areaid) {
        if (areaid){
            return data.filter(function (item) {
                return item.areaId == areaid;
            })
        }
        return data
    }
};