/*
 * @Author: Avenda
 * @Date: 2018/10/14
 */

/*
 * @Author: Avenda
 * @Date: 2018/10/6
 */

require('./index.css');
var _user       = require('service/user-service.js');
var verifyPlug  = require('util/vertifyFunc.js');

var consts          = {
    valUsername         :   '#username',
    valPass             :   '#password',
    submitId            :   '#submit',
    resetPass           :   '#reset-password'
};
var cache = {
    keyForbid: true,
    timer           :undefined,
    username        :'',
    qaCode          :'',
    password        :'',
    callBackObj    :{}

};
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
    flushNav:function () {
        cache.callBackObj.flushNav();
    }
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
            return false;
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
        // 开始登录
        _user.login(formData, function (res) {
            // 登录成功
            // 刷新Nav登录状态
            cache.callBackObj.flushNav();
            // 改变详情页调用登录状态
            if (cache.callBackObj.changeState) {
                cache.callBackObj.changeState();
            }
            // 关闭弹窗
            $("#login-close").click();
            // 显示成功函数
            cache.callBackObj.showSuccess();
            // window.location.href = _mm.getUrlParam('redirect') || './index.html';
        }, function (err) {
            // 请求失败后的回调函数
            if (err.status === 404) {
                mfuncs.errAlertFunc(consts.valPass, "与服务器连接失败");
                return ;
            }
            mfuncs.errAlertFunc(consts.valPass, err);
        });
    }

};
var alertWindow = {

    init            :function () {
        this.bindEvent();

    },
    bindEvent       :function () {
        var _this = this;
        $("#login-open-alert").click(function () {
            $('.login-window').show();
            // 禁用键盘
            cache.keyForbid = false;
        });

        $("#login-close").click(function () {
            $('.login-window').hide();
            // 开启键盘
            cache.keyForbid = true;
        });
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
    show            :function (callBackObj) {
        // 传入调永对象的回调引用
        cache.callBackObj = callBackObj;
        $("#login-open-alert").click();

    },
    // 提交表单
    submit          : function () {
        // 1. 提取数据
        mfuncsVerify.usernameValid();
    }


};
alertWindow.init();
module.exports = alertWindow;
