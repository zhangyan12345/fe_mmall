require('./index.css');
require('page/common/nav-simple/index.js');
var _user       = require('service/user-service.js');
var _mm         = require('util/mm.js');
var verifyPlug  = require('util/vertifyFunc.js');
var _alert      = require('util/alert-window/index.js');

// 常量池
var consts          = {
    valUsername         :   '#username',
    valPass             :   '#password',
    submitId            :   '#submit',
    resetPass           :   '#reset-password'
};
// 缓存池
var cache           = {
    timer           :undefined,
    username        :'',
    qaCode          :'',
    password        :'',

};
// 功能池
var mfuncs          = {
    sucAlertFunc              : function (item,sucMsg) {
        $((item+"-suc").replace(/#/,".")).show().find(item+"-suc").text(sucMsg || '');
        $((item+"-err").replace(/#/,".")).hide();
        $(item).removeClass('border-err');
        $(item).addClass('border-suc');
    },
    errAlertFunc              : function (item,errMsg) {
        if (errMsg) {
            $((item+"-err").replace(/#/,".")).show().find(item+"-err").text(errMsg || '');
            $((item+"-suc").replace(/#/,".")).hide();
            $(item).removeClass('border-suc');
            $(item).addClass('border-err');
        }
    },
    hideStyle                 : function (item) {
        $(item).removeClass('border-suc');
        $(item).removeClass('border-err');
        $((item+"-suc").replace(/#/,".")).hide();
        $((item+"-err").replace(/#/,".")).hide();
    },
    // 是否允许submit提交
    submit:function() {
        var $element = $(consts.submitId);
        if (cache.access[0]===true && cache.access[1]===true) {
            $element.removeAttr("disabled");
        } else {
            $element.attr("disabled", "disabled");

        }
    },
};
var mfuncsVerify    = {
    usernameValid:function () {
        var _this = this;
        var username = $.trim($(consts.valUsername).val());
        var password = $.trim($(consts.valPass).val());
        var result = verifyPlug.commonValid(username,"username");
        var resultPass = verifyPlug.commonValid(password, "password");
        // 格式不合法
        if (!result.status) {
            mfuncs.errAlertFunc(consts.valUsername,result.msg);
            return ;
        }
        if (!resultPass.status) {
            mfuncs.errAlertFunc(consts.valPass, resultPass.msg);
            return;
        }
        cache.password = password;
        cache.username = username;
        // 格式合法, 调用接口认证

        _user.checkUsernameExist(username,function () {

            mfuncs.errAlertFunc(consts.valUsername,"用户名不存在");
            // 禁用登录按钮
        },function () {
            // 用户名存在
            mfuncs.sucAlertFunc(consts.valUsername);
            _this.passwordValid();
        });
    },
    passwordValid:function () {

        mfuncs.sucAlertFunc(consts.valPass);
        // 开启登录按钮

        var formData = {
            username: cache.username,
            password: cache.password
        };
        _user.login(formData, function (res) {
            window.location.href = _mm.getUrlParam('redirect') || './index.html';
        }, function (err) {
            // 请求失败后的回调函数
            if (err.status === 404) {
                _alert.show("无法连接到服务器 (404)");
                return;
            }
            mfuncs.errAlertFunc(consts.valPass, err.status || err);
        });
    }

};
// 主逻辑
var userLogin       = {
    init            :function () {
        this.bindEvent();
    },
    bindEvent       : function () {
        var _this = this;
        $(consts.resetPass).click(function () {
            window.location.href="./user-pass-reset.html"
        });
        $('#submit').click(function () {
            _this.submit();
        });

        $(consts.valUsername).keydown(function (event) {
            mfuncs.hideStyle(consts.valUsername);
        }).blur(function (event) {
            // 添加成功框
            if (event.currentTarget.value) {
                mfuncs.sucAlertFunc("#"+event.currentTarget.id);
            }
        });
        $(consts.valPass).keydown(function (e) {
            mfuncs.hideStyle(consts.valPass);
            // 如果在密码输入框上回车则提交表单, keyCode ===13 表示回车
            if (e.keyCode === 13) {
                $(consts.submitId).click();
            }
        }).blur(function (event) {
            // 添加成功框
            if (event.currentTarget.value) {
                mfuncs.sucAlertFunc("#"+event.currentTarget.id);
            }
        });


    },
    // 提交表单
    submit          : function () {
        // 1. 提取数据
        mfuncsVerify.usernameValid();
    },
    // 表单验证


};

userLogin.init();