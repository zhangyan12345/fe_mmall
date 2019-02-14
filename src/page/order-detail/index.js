/*
 * @Author: Avenda
 * @Date: 2018/10/6
 */

require('./index.css');
require('page/common/nav-side/index.js');
var _header = require('page/common/header/index.js');

var _nav            = require('page/common/nav/index.js');
var _navside        = require('page/common/nav-side/index.js');
var _mm             = require('util/mm.js');
var _user           = require('service/user-service.js');
var _alert          = require('util/alert-window/index.js');
var _conriemWin     = require('util/confirm-window/index.js');
var _orderService   = require('service/order-service.js');
var indexTemp = require('./index.string');


// 常量池
var consts              = {
    detailCon:'.order-detail-con',
    cancelOrder:'#cancel-order',
    payNow:'#pay-now'
};
// 缓存池
var cache               = {
   orderNo : ''
};
// 功能池
var mfuncs              = {
    // 检查登录
    checkLogin:function(){
        _user.checkLogin(function (res) {

        },function (err) {
            _alert.show(err.status || err);
            setTimeout(function () {
                _mm.doLogin();
            },1500);
        });
    },
    // 加载订单详情内容
    loadDetaiCon:function () {
        // 请求接口
        _orderService.getOrderDetail(cache.orderNo,function (res) {
            console.log(res);
            var html = '';
            var detailCon = $(consts.detailCon);
            // 渲染html
            html = _mm.renderHtml(indexTemp,res);
            detailCon.hide().html(html);
            // 更改oper内容
            var oper = $('.order-info-wrap .oper');
            if (res.status === 20) {
                oper.html('<span class="btn-white" >付款成功</span>')
            }
            if (res.status === 0) {
                oper.html('<span class="btn-white" >已取消</span>')
            }
            detailCon.fadeIn(300);

        },function (err) {
            _alert.show(err.status || err);
        });
    },
    // 取消订单
    cancelOrder:function () {
        _conriemWin.show("是否取消当前订单?",function () {
            _orderService.cancelOrder(cache.orderNo,function (res) {
                mfuncs.loadDetaiCon();
            },function (err) {
                _alert.show(err.status || err);
            });
        });
    },
    // 立即支付
    payNow:function () {
        if (cache.orderNo) {
            window.location.href = './payment.html?orderNo='+cache.orderNo;
        }
    }
};
// 主逻辑
var orderList           = {
    init            : function () {
        this.preLoad();
        this.doCheck();
        this.onLoad();
        this.bindEvent();
        this.runtime();
    },
    preLoad         : function () {
        // 激活nav按钮
        _nav.orderActive();
        // 显示 header 二级子标题
        _header.showSubtitle("订单详情");
        // 激活侧边栏按钮
        _navside.init("order-list");
        // 提取orderNo
        cache.orderNo = _mm.getUrlParam("orderNo");

    },
    doCheck         : function () {

    },
    onLoad          : function () {
        mfuncs.loadDetaiCon();
    },
    bindEvent       : function () {
        $(document).on('click',consts.cancelOrder,function () {
            mfuncs.cancelOrder();
        });
        $(document).on('click',consts.payNow,function () {
            mfuncs.payNow();
        })
    },
    runtime         : function () {}
};
// 初始化左侧信息

orderList.init();