var _mm = require('util/mm.js');
var payment = {
    // 创
    payment: function (orderNo, resolve, reject) {
        _mm.request({
            url: _mm.getServerUrl('/order/pay.do'),
            method: 'POST',
            // 接受一个方法
            data:{
                orderNo:orderNo
            },
            success: resolve,
            // 接受一个方法
            error: reject
        })
    },
    getPaymentStatus: function (orderNo, resolve, reject) {
        _mm.request({
            url: _mm.getServerUrl('/order/query_order_pay_status.do'),
            method: 'POST',
            // 接受一个方法
            data:{
                orderNo:orderNo
            },
            success: resolve,
            // 接受一个方法
            error: reject
        })
    },


};
module.exports = payment;