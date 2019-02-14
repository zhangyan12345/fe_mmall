var _mm = require('util/mm.js');
var _mm = require('util/mm.js');
 _cart = {
    // 检查登录状态
    getCartCount: function (resolve, reject) {
        _mm.request({
            url: _mm.getServerUrl('/cart/get_cart_product_count.do'),
            method: 'POST',
            // 接受一个方法
            success: resolve,
            // 接受一个方法
            error: reject
        })
    },
    addTocart: function (productInfo, resolve, reject) {
        _mm.request({
            // url: _mm.getServerUrl('/cart/none.do'),
            url: _mm.getServerUrl('/cart/add.do'),
            method: 'post',
            data: productInfo,
            // 接受一个方法
            success: resolve,
            // 接受一个方法
            error: reject
        })
    },
    getCartList: function (resolve, reject) {
        _mm.request({
            url: _mm.getServerUrl('/cart/list.do'),
            method: 'post',
            // 接受一个方法
            success: resolve,
            // 接受一个方法
            error: reject
        })
    },
    SelectProduct: function (productId, resolve, reject) {
        _mm.request({
            url: _mm.getServerUrl('/cart/select.do'),
            method: 'post',
            data: {
                productId: productId
            },
            // 接受一个方法
            success: resolve,
            // 接受一个方法
            error: reject
        })
    },
    unSelectProduct: function (productId, resolve, reject) {
        _mm.request({
            url: _mm.getServerUrl('/cart/un_select.do'),
            method: 'post',
            data: {
                productId: productId
            },
            // 接受一个方法
            success: resolve,
            // 接受一个方法
            error: reject
        })
    },
    selectAll: function (resolve, reject) {
        _mm.request({
            url: _mm.getServerUrl('/cart/select_all.do'),
            method: 'post',
            // 接受一个方法
            success: resolve,
            // 接受一个方法
            error: reject
        })
    },
    unSelectAll: function (resolve, reject) {
        _mm.request({
            url: _mm.getServerUrl('/cart/un_select_all.do'),
            method: 'post',
            // 接受一个方法
            success: resolve,
            // 接受一个方法
            error: reject
        })
    },
    updataProductCount:function (productInfo,resolve,reject) {
        _mm.request({
            url: _mm.getServerUrl('/cart/update.do'),
            method: 'post',
            data:productInfo,
            // 接受一个方法
            success: resolve,
            // 接受一个方法
            error: reject
        })
    },
    deleteProduct:function (productIds,resolve,reject) {
        _mm.request({
            url: _mm.getServerUrl('/cart/delete_product.do'),
            method: 'post',
            data:{
                productIds:productIds
            },
            // 接受一个方法
            success: resolve,
            // 接受一个方法
            error: reject
        })
    },

};
module.exports = _cart;