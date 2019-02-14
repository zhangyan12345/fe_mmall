/*
 * @Author: Avenda
 * @Date: 2018/10/6
 */

require('./index.css');
var _nav                = require('page/common/nav/index.js');
var _mm                 = require('util/mm.js');
var _alert              = require('util/alert-window/index.js');

// 常量池
var consts              = {
    toDetail    :'#to-order-detail',
    toHome      :'#to-home'
};
// 缓存池
var cache               = {
    orderNo:'',
};
// 功能池
var mfuncs              = {
    getOrderNo:function () {
        cache.orderNo = _mm.getUrlParam('orderNo');
    },
};
// 主逻辑
var paySuc        = {
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
        _nav.aboutActive();
    },
    doCheck         : function () {
    },
    onLoad          : function () {

    },
    bindEvent       : function () {
        $(consts.toDetail).click(function () {
            window.location.href = './order-detail.html?orderNo=' + cache.orderNo;
        });
        $(consts.toHome).click(function () {
            window.location.href = './index.html';
        });
    },
    runtime         : function () {}
};
// 初始化左侧信息
paySuc.init();