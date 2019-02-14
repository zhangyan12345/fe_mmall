/*
 * @Author: Avenda
 * @Date: 2018/10/10
 */

var _mm = require('util/mm.js');
var _product = {
    // 检查登录状态
    getProductList      :function (listParam, resolve, reject) {
        _mm.request({
            url: _mm.getServerUrl('/product/list.do'),
            method  :   'POST',
            data  :   listParam,
            // 接受一个方法
            success :   resolve,
            // 接受一个方法
            error   :   reject
        })
    },
    getProductDetail      :function (productId, resolve, reject) {
        _mm.request({
            // url: _mm.getServerUrl('/testLocal/testMain.do'),
            url: _mm.getServerUrl('/product/detail.do'),
            method  :   'POST',
            data:{
                productId:productId
            },
            // 接受一个方法
            success :   resolve,
            // 接受一个方法
            error   :   reject
        })
    }
};
module.exports = _product;