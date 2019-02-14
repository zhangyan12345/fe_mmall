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
var _alert          = require('page/common/alert-window');

// 常量池
var consts      = {
    valPanelContent :'#panel-content',
    gotoUpdate      :'#goto-update'
};
// 缓存池
var cache       = {};
// 功能池
var mfuncs      = {};
// 主逻辑
var userCenter  = {
    init            :function () {
        // 激活nav按钮
        _nav.userCenterActive();
        // 显示 header 二级子标题
        _header.showSubtitle("个人中心");
        this.bindEvent();
        this.loadUserInfo();
    },
    bindEvent       :function () {
        $(consts.gotoUpdate).click(function () {
            window.location.href = './user-center-update.html';
        });
    },
    loadUserInfo    :function () {
        var userHtml = '';
        _user.getUserInfo(function (res) {
            userHtml = _mm.renderHtml(template,res);
            $(consts.valPanelContent).hide().html(userHtml).fadeIn(300);
        },function (err) {
            if (err.status===404) {
                _alert.show("加载用户信息失败,请确认网络状态");
            }
            _mm.doLogin();
        });
    }
};
// 初始化左侧信息

_navside.init("user-center");
userCenter.init();