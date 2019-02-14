/*
 * @Author: Avenda
 * @Date: 2018/10/7
 */
require('./index.css');
require('page/common/nav-side/index.js');
var _header = require('page/common/header/index.js');
var _nav = require('page/common/nav/index.js');
var _navside            = require('page/common/nav-side/index.js');
var _mm                 = require('util/mm.js');
var _user               = require('service/user-service.js');
var _alert              = require('page/common/alert-window');
var _tools              = require('util/tools.js');
var _vertify            = require('util/vertifyFunc.js');
// 常量池
var consts          = {
    // 页面+常量名
    passUpdate_oldPass          :'#oldPass',
    passUpdate_newPass          :'#newPass',
    passUpdate_newPassConfirm   :'#newPassConfirm',
    passUpdate_submit           :'#submit'
};
// 缓存池
var cache           = {
    passUpdate_oldPass:'',
    passUpdate_newPass:'',

};
// 功能池
var mfuncsVerify    = {
    checkPassOld            : function () {
        var passOld = $.trim($(consts.passUpdate_oldPass).val());
        if (!passOld) {
            _tools.errAlertFunc(consts.passUpdate_oldPass, "旧密码不能为空");
            return false;
        }
        cache.passUpdate_oldPass = passOld;
        _tools.sucAlertFunc(consts.passUpdate_oldPass);
        return true;
    },
    checkPassNew            :function () {

        var passNew = $.trim($(consts.passUpdate_newPass).val());
        // 调用密码验证工具
        var result = _vertify.passWithConfirm(
            consts.passUpdate_newPass, consts.passUpdate_newPassConfirm,
            _tools.sucAlertFunc, _tools.errAlertFunc
        );
        if (!result) {
            return false;
        }
        // 成功后赋值
        cache.passUpdate_newPass = passNew;
        return true;

    },
    checkPassNewConfirm     :function () {

        var passNewConfirm = $.trim($(consts.passUpdate_newPassConfirm).val());
        // 调用密码验证工具
        var result = _vertify.confirmWithPass(
            consts.passUpdate_newPass, consts.passUpdate_newPassConfirm,
            _tools.sucAlertFunc, _tools.errAlertFunc
        );
        if (!result) {
            return false;
        }
        // 成功后赋值
        cache.passUpdate_newPass = passNewConfirm;
        return true;
    }

};
// 主逻辑
var userCenter      = {
    init                    :function () {
        // 激活nav个人中心按钮
        _nav.userCenterActive();
        // 显示header二级title
        _header.showSubtitle("修改密码");
        this.checkUserLogin();
        this.bindEvent();
    },
    bindEvent               :function () {
        var _this = this;
        $(consts.passUpdate_submit).click(function () {
            _this.submit();
        });
        $(consts.passUpdate_oldPass).blur(function () {
            mfuncsVerify.checkPassOld();
        });
        $(consts.passUpdate_newPass).blur(function () {
            mfuncsVerify.checkPassNew();
        });
        $(consts.passUpdate_newPassConfirm).blur(function () {
            mfuncsVerify.checkPassNewConfirm();
        });

    },
    // 检查用户登录状态
    checkUserLogin          :function () {
        var _this = this;
        _user.checkLogin(function (res) {

        },function (err) {
            _mm.doLogin();
        });
    },
    submit                  :function () {
        if (mfuncsVerify.checkPassOld() && mfuncsVerify.checkPassNew() && mfuncsVerify.checkPassNewConfirm()) {

            var userInfo = {
                passwordOld: cache.passUpdate_oldPass,
                passwordNew: cache.passUpdate_newPass
            };
            // 请求服务器修改密码
            _user.updateUserPass(userInfo, function (res) {
                _alert.show("密码修改成功");
                setTimeout(function () {
                    window.location.href = './user-center.html';
                },1000);
            },function (err) {
                if (err.status === 404) {
                    _alert.show("与服务器通通讯失败 (404)");
                } else {
                    _tools.errAlertFunc(consts.passUpdate_oldPass, err);
                }

            });
        }
    }
};

// 初始化左侧信息

_navside.init("pass-update");
userCenter.init();