require('./index.css');
var _mm                 = require('util/mm.js');
var _userService        = require('service/user-service.js');
var _cart               = require('service/cart-service.js');

var nav                 = {
    // 初始化功能 ( init )
    init            :function () {
        this.bindEvent();
        this.loadUserInfo();
        this.loadCartCount();
        // 返回调用者
        return this;
    },
    // bindEvernt
    bindEvent       :function () {
        // 登录点击事件
        $('.js-login').click(function () {
            _mm.doLogin();
        });
        $('.login-logo').click(function () {
            _mm.doLogin();
        });
        // 注册点击事件
        $('.js-register').click(function () {
            window.location.href = './user-register.html';
        });
        // 退出点击事件
        $('.js-logout').click(function () {
            _userService.logOut(function (res) {
                // 退出成功的时候, 刷新页面重新请求接口
                window.location.reload();
            }, function (err) {
                // 错误的时候, 调用提示
                _mm.errorTip(err.statusText);
            });
        });
        // 个人中心事件
        $('#go-personal-center').click(function () {
            // 校验登录状态
            _userService.checkLogin(function (res) {
                window.location.href = './user-center.html';
            },function (err) {
                _mm.doLogin();
            });
        });
        // 是否在进入购物车之前卡一下
        // $('#nav-goto-card').click(function () {
        //     _userService.checkLoginSyc(function () {
        //         window.location.href = './cart.html';
        //     },function () {
        //         _mm.doLogin();
        //     });
        // });
    },
    // 加载用户信息 ( loadUserInfo )
    loadUserInfo    :function () {
        // 因为是把chekLogin的参数方法注入到ajax的success方法的参数方法上,所以所以
        _userService.checkLogin(function (res) {
            // 隐藏没登录的组件, 然后显示已经登录的组件
            $('.user.not-login').hide().siblings('.user.login').fadeIn(200).find('.username').text(res.username);
        },function (err) {
            // do nothing
            $('.user.login').hide().siblings('.user.not-login').fadeIn(200);
        });
    },
    // 加载购物车数量( loadCartCount )
    loadCartCount   :function () {
        _cart.getCartCount(function (res) {
            $('.nav .cart-count').text(( res) ||  0 );
        },function (errMsg) {
            $(' .nav .cart-count').text(0)
        });
    },
    // 激活购物车按钮
    cartActive      :function () {
        $('.nav-item.cart').addClass('active');
    },
    // 激活用户中心按钮
    userCenterActive:function () {
        $('.nav-item.user-center').addClass('active');
    },
    orderActive      :function () {
        $('.nav-item.order-list').addClass('active');
    },
    aboutActive     :function () {
        $('.nav-item.about').addClass('active');
    }

};
nav.init();
module.exports = nav;