/*
 * @Author: Avenda
 * @Date: 2018/10/6
 */

require('./index.css');
require('page/common/nav-side/index.js');
var _header = require('page/common/header/index.js');

var _nav = require('page/common/nav/index.js');
var _navside        = require('page/common/nav-side/index.js');
var template        = require('./index.string');
var _mm             = require('util/mm.js');
var _user           = require('service/user-service.js');
var _alert           = require('util/alert-window/index.js');
var _conriemWin = require('util/confirm-window/index.js');
var listTemplate = require('./index.string');
var Pagination = require('util/pagination/index.js');
var _pagination = new Pagination();
var _orderService = require('service/order-service.js');
// 常量池
var consts              = {
    orderListCon:'.order-list-con',
    pagination:'.pagination',
    cancelOrder:'.cancel-order',
    payNow:'.pay-now',
    orderItem:'.order-item'
};
// 缓存池
var cache               = {
    pageNum:'1',
    pageSize:'10',
    currentOrderNo:''
};
// 功能池
var mfuncs              = {
    // 加载orderList
    loadOrderList:function () {

        // 请求接口, 得到数据, 渲染模板, 显示
        _orderService.getOrderList({
            pageNum:cache.pageNum,
            pageSize:cache.pageSize
        },function (res) {
            console.log(res);
            // 渲染空
            var html = ' <div class="empty-con">\n' +
                '                    <span class="symbol"></span>\n' +
                '                    <span class="empty-text">没有相关订单信息</span>\n' +
                '                </div>';
            // 如果没有订单就显示空提示
            if (res.list.length<=0) {
                $(consts.orderListCon).hide().html(html).fadeIn(300);
                return;
            }
            // 渲染list模板
            html = _mm.renderHtml(listTemplate, res);
            $(consts.orderListCon).hide().html(html);
            mfuncs.initItem();
            $(consts.orderListCon).fadeIn(300);
            // 渲染分页
            mfuncs.loadPagination(res);
        },function (err) {
            _alert.show(err.status || err);
        });
    },
    // 加载分页组件
    loadPagination:function (res) {
        var pageInfo = {
            container: $(consts.pagination),
            hasPreviousPage: res.hasPreviousPage,
            hasNextPage: res.hasNextPage,
            prePage: res.prePage,
            pageNum: res.pageNum,
            nextPage: res.nextPage,
            lastPage: res.lastPage,
            isFirstPage: res.isFirstPage,
            isLastPage: res.isLastPage,
            pageSize: res.pageSize,
            pages: res.pages,
            onSelectPage:mfuncs.onSelectPage
        };

        _pagination.render(pageInfo);

    },
    // 定义回调函数
    onSelectPage: function (selectPageNum) {
        // 赋值选中的页码到cache
        cache.pageNum = selectPageNum;
        // 重新加载清单和分页
        mfuncs.loadOrderList();
    },
    // 删除订单
    cancelOrder:function () {
        _orderService.cancelOrder(cache.currentOrderNo,function (res) {
            cache.pageNum = 1;
            // 重加载订单页
            mfuncs.loadOrderList();
            // 清空缓存orderNo
            cache.currentOrderNo = '';
        },function (err) {
            _alert.show(err.status || err);
        });
    },
    // 前往支付
    payNow:function (currentItem) {
        var orderNo = currentItem.parents('.order-item').data('orderNo');
        if (orderNo) {
            window.location.href = './payment.html?orderNo='+orderNo;
        }
    },
    initItem:function () {
        var orderItem = $(consts.orderItem);
        orderItem.each(function (index, o) {
            var obj = $(o);
            // 根据status改造html
            var status = obj.data('status');
            // 付款成功
            if (status===20) {
                obj.addClass('finish');
                var operCom = '<div class="btn-white btn-mini">付款成功</div>';
                obj.find('.order-oper').html(operCom);
                return;
            }
            // 等待付款
            if (status===10) {
                obj.addClass('active');
                var operCon = '  <a class="btn btn-mini pay-now">立即支付</a>\n' +
                    '            <div class="cancel-order link-f">取消订单</div>  ';
               obj.find('.order-oper').html(operCon);
                return;

            }
        })
    }
};
// 主逻辑
var orderList        = {
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
        _header.showSubtitle("我的订单");
        // 激活侧边栏按钮
        _navside.init("order-list");
    },
    doCheck         : function () {
        _user.checkLogin(function (res) {

        },function (err) {
            _alert.show(err.status || err);
            setTimeout(function () {
                _mm.doLogin();
            },1500);
        });
    },
    onLoad          : function () {
        mfuncs.loadOrderList();


    },
    bindEvent       : function () {
        $(document).on('click',consts.cancelOrder,function () {
            // 对当前orderNo进行缓存
            cache.currentOrderNo = $(this).parents('.order-item').data('order-no');
            // 确认后删除
            _conriemWin.show("是否取消此订单?", mfuncs.cancelOrder);


        });
        $(document).on('click',consts.payNow,function () {
            mfuncs.payNow($(this));
        });
    },
    runtime         : function () {}
};
// 初始化左侧信息

orderList.init();