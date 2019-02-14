var _mm = require('util/mm.js');
var order = {
    // 创建订单
    getAddrList: function (resolve, reject) {
        _mm.request({
            url: _mm.getServerUrl('/shipping/list.do'),
            method: 'POST',
            // 接受一个方法
            data:{
                pageNum:1,
                pageSize:50
            },
            success: resolve,
            // 接受一个方法
            error: reject
        })
    },
    deleteAddrItem: function (shippingId, resolve, reject) {
        _mm.request({
            url: _mm.getServerUrl('/shipping/del.do'),
            method: 'POST',
            // 接受一个方法
            data:{
                shippingId:shippingId
            },
            success: resolve,
            // 接受一个方法
            error: reject
        })
    },
    addNewAddrItem: function (addrItemInfo, resolve, reject) {
        _mm.request({
            url: _mm.getServerUrl('/shipping/add.do'),
            method: 'POST',
            // 接受一个方法
            data:addrItemInfo,
            success: resolve,
            // 接受一个方法
            error: reject
        })
    },
    updateAddr: function (addrItemInfo, resolve, reject) {
        _mm.request({
            url: _mm.getServerUrl('/shipping/update.do'),
            method: 'POST',
            // 接受一个方法
            data:addrItemInfo,
            success: resolve,
            // 接受一个方法
            error: reject
        })
    },
    selectAddr: function (shippingId, resolve, reject) {
        _mm.request({
            url: _mm.getServerUrl('/shipping/select.do'),
            method: 'POST',
            // 接受一个方法
            data:{
                shippingId:shippingId
            },
            success: resolve,
            // 接受一个方法
            error: reject
        })
    },
    getOrderCart: function ( resolve, reject) {
        _mm.request({
            url: _mm.getServerUrl('/order/get_order_cart_product.do'),
            method: 'POST',
            // 接受一个方法
            success: resolve,
            // 接受一个方法
            error: reject
        })
    },
    createOrder: function (shippingId, resolve, reject) {
        _mm.request({
            url: _mm.getServerUrl('/order/create.do'),
            method: 'POST',
            data:{
                shippingId:shippingId
            },
            // 接受一个方法
            success: resolve,
            // 接受一个方法
            error: reject
        })
    },
    getOrderList:function (pgInfo, resolve, reject) {
        _mm.request({
            url: _mm.getServerUrl('/order/list.do'),
            method: 'POST',
            data:pgInfo,
            // 接受一个方法
            success: resolve,
            // 接受一个方法
            error: reject
        })
    },
    cancelOrder:function (orderNo, resolve, reject) {
        _mm.request({
            url: _mm.getServerUrl('/order/cancel.do'),
            method: 'POST',
            data:{
                orderNo:orderNo
            },
            // 接受一个方法
            success: resolve,
            // 接受一个方法
            error: reject
        })
    },
    getOrderDetail:function (orderNo, resolve, reject) {
        _mm.request({
            url: _mm.getServerUrl('/order/detail.do'),
            method: 'POST',
            data:{
                orderNo:orderNo
            },
            // 接受一个方法
            success: resolve,
            // 接受一个方法
            error: reject
        })
    },

};
module.exports = order;