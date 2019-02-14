/*
 * @Author: Avenda
 * @Date: 2018/10/6
 */

require('./index.css');
var _nav = require('page/common/nav/index.js');
var _mm                 = require('util/mm.js');
var _user               = require('service/user-service.js');
var _alert              = require('util/alert-window/index.js');
var _confirmWin         = require('util/confirm-window/index.js');
var _paymentService     = require('service/payment-service.js');
var template            = require('./index.string');
// 常量池
var consts              = {
    paymentCon:'.payment-con'
};
// 缓存池
var cache               = {
    orderNo:'',
    timer:''
};
// 功能池
var mfuncs              = {
    getOrderNo:function () {
        cache.orderNo = _mm.getUrlParam('orderNo');
    },
    loadPaymentCon:function () {
        // 请求接口得到二维码
        _paymentService.payment(cache.orderNo,function (res) {
            var html = '';
            html = _mm.renderHtml(template, res);
            console.log(res);
            $(consts.paymentCon).hide().html(html).fadeIn(300);
        },function (err) {
            _alert.show(err.status || err);
        });
    },
    listenPayback:function () {
        clearInterval(cache.timer);
        cache.timer = setInterval(function () {
            _paymentService.getPaymentStatus(cache.orderNo,function (res) {
                if (res) {
                    window.location.href = './pay-suc.html?orderNo=' + cache.orderNo;
                }
            },function (err) {
                _alert.show(err.status || err);
            });
        },5000);
    }
};
// 主逻辑
var payment        = {
    init            : function () {
        this.preLoad();
        this.doCheck();
        this.onLoad();
        this.bindEvent();
        this.runtime();
    },
    preLoad         : function () {
        //拿到页面传来的orderNo
        mfuncs.getOrderNo();
    },
    doCheck         : function () {
    },
    onLoad          : function () {
        mfuncs.loadPaymentCon();
        mfuncs.listenPayback();
    },
    bindEvent       : function () {

    },
    runtime         : function () {}
};
// 初始化左侧信息
payment.init();