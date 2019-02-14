/*
 * @Author: Avenda
 * @Date: 2018/10/3
 */
require('./index.css');
require('common/nav-simple/index.js');
var _mm             = require('util/mm.js');
var _user           = require('service/user-service.js');
var _alert          = require('util/alert-window/index.js');
// 功能及变量容器
var consts          = {
    username        :'#username',
    password        :'#password',
    passConfirm     :'passwordConfirm',
    phone           :'#phoneNumber',
    email           :'#email',
    passQuestion    :'#passwordQuestion',
    passAnswer      :'#passwordAnswer'
};
var caches          = {
    inputStatus     : [false, false, false, false, false, false],
    timer           :''
};
var funcs           = {
    // 最后的判定通行证
    // 0. username验证  1.密码格式与匹配 2.手机 3.邮箱 4.密码提示问题 5. 密码提示答案
    access: [false, false, false, false, true, true],
    // 0. username  1.密码  1.密码确认 3.手机 4.邮箱 5.密码提示问题 6. 密码提示答案

    // 异步超时系统
    ajaxReady           : {username:0, email:0},
    retryTimesMax       : 100,
    retryTimesCurrent   : 0,
    usernameId          : 'username',
    passwordId          : 'password',
    passwordConfirmId   : 'passwordConfirm',
    phoneNumberId       : 'phoneNumber',
    emailId             : 'email',
    passwordQuestionId  : 'passwordQuestion',
    passwordAnswerId    : 'passwordAnswer',
    // 获取表单数据
    getFormDate     : function () {
        return {
            username            : $.trim($("#username").val()),
            password            : $.trim($("#password").val()),
            passwordConfirm     : $.trim($("#passwordConfirm").val()),
            phoneNumber         : $.trim($("#phoneNumber").val()),
            email               : $.trim($("#email").val()),
            passwordQuestion    : $.trim($("#passwordQuestion").val()),
            passwordAnswer      : $.trim($("#passwordAnswer").val())
        }
    },
    // 通用提示信息显示与隐藏
    formAlert       : {
        show: function (itemId, errMsg) {
            $('.' + itemId).show().find('#' + itemId).text(errMsg || '');
        },
        hide: function (ItemId, errMsg) {
            $('.' + ItemId).hide().find('#err-msg').text(errMsg || '');
        },
        errBorder: function (ItemIDorClass, status) {
            if (status) {
                $(ItemIDorClass).removeClass('border-suc');
                $(ItemIDorClass).addClass('border-err');
            } else {
                $(ItemIDorClass).removeClass('border-err');
                $(ItemIDorClass).addClass('border-suc');
            }
        }
    },
    // 正确显示, 错误显示, 焦点时清除样式通用方法
    sucFunc         : function (itemId) {
        this.formAlert.errBorder('#' + itemId);
        this.formAlert.hide(itemId + '-err');
        this.formAlert.show(itemId + '-suc');
    },
    errAlertFunc    : function (itemId, msg) {
        if (msg) {
            this.formAlert.errBorder('#' + itemId, true);
            this.formAlert.hide(itemId + '-suc');
            this.formAlert.show(itemId + '-err', msg);
        }
    },
    clearStyle      : function (itemId) {
        // this.formAlert.errBorder('#' + itemId);
        this.formAlert.hide(itemId + '-err');
        this.formAlert.hide(itemId + '-suc');
    },
    // 是否开启submit的disabled状态
    submitVerify    : function () {
        // 做缓存
        var access = this.access;
        var submit = $("#submit");
        for (var i = 0, iLength = access.length; i < iLength; i++) {
            if (!access[i]) {
                submit.attr("disabled", "disabled");
                return;
            }
        }
        submit.removeAttr("disabled");
    },
    disabledAll     : function () {
        $('#'+funcs.usernameId).attr("disabled", "disabled");
        $('#'+funcs.passwordId).attr("disabled", "disabled");
        $('#'+funcs.passwordConfirmId).attr("disabled", "disabled");
        $('#'+funcs.phoneNumberId).attr("disabled", "disabled");
        $('#'+funcs.emailId).attr("disabled", "disabled");
        $('#'+funcs.passwordAnswerId).attr("disabled", "disabled");
        $('#'+funcs.passwordQuestionId).attr("disabled", "disabled");
    },
    unableAll       : function () {
        $('#'+funcs.usernameId).removeAttr("disabled");
        $('#'+funcs.passwordId).removeAttr("disabled");
        $('#'+funcs.passwordConfirmId).removeAttr("disabled");
        $('#'+funcs.phoneNumberId).removeAttr("disabled");
        $('#'+funcs.emailId).removeAttr("disabled");
        $('#'+funcs.passwordAnswerId).removeAttr("disabled");
        $('#'+funcs.passwordQuestionId).removeAttr("disabled");

    }
};
// 主逻辑
var register = {
    init                        : function () {
        this.bindEvent();
    },
    // 绑定事件
    bindEvent                   : function () {
        var _this = this;
        // 验证username, blur为失焦事件-------------------------------------------
        $('#username').blur(function () {
            // 验证用户名
            if (caches.inputStatus[0]) {
                _this.usernameValidFinal();
            }
        }).focus(function (event) {
            // 输入时候清空样式
            funcs.clearStyle(funcs.usernameId);
        }).keyup(function (event) {
            if ($(this).val()) {
                caches.inputStatus[0] = true;
            }
            // 屏蔽中文
            event.currentTarget.value = event.currentTarget.value.replace(/[^\w\.\/]/ig, '');
        });
        // 验证密码, blur为失焦事件-------------------------------------------
        $('#password').blur(function () {
            if ( caches.inputStatus[1]) {
                _this.passwordValidFinal();
            }
        }).focus(function () {
            funcs.clearStyle(funcs.passwordId);
        }).keyup(function () {
            if ($(this).val()) {
                caches.inputStatus[1] = true;
            }
        });
        // 密码确认,-------------------------------------------
        $('#passwordConfirm').blur(function () {
            if ( caches.inputStatus[1] || caches.inputStatus[2]) {
                _this.passwordConfirmValidFinal();
            }

        }).focus(function () {
            funcs.clearStyle(funcs.passwordConfirmId);
        }).keyup(function () {
            if ($(this).val()) {
                caches.inputStatus[2] = true;
            }
        });
        // 手机确认, -------------------------------------------
        $('#phoneNumber').blur(function () {
            if (caches.inputStatus[2]) {
                _this.phoneValidFinal();
            }
        }).focus(function () {
            funcs.clearStyle(funcs.phoneNumberId);
        }).keyup(function () {
            if ($(this).val()) {
                caches.inputStatus[3] = true;
            }
        });
        // 邮箱, -------------------------------------------
        $('#email').blur(function () {
            if (caches.inputStatus[4]) {
                _this.emailValidFinal();
            }

        }).focus(function () {
            funcs.clearStyle(funcs.emailId);
        }).keyup(function () {
            if ($(this).val()) {
                caches.inputStatus[4] = true;
            }
        });
        // 密码提示问题, -------------------------------------------
        $('#passwordQuestion').blur(function () {
            _this.passwordQuestionValidFinal();
        }).focus(function () {
            funcs.clearStyle(funcs.passwordQuestionId);
        });
        // 密码提示问题, -------------------------------------------
        $('#passwordAnswer').blur(function () {
            _this.passwordAnswerValidFinal();
        }).focus(function () {
            funcs.clearStyle(funcs.passwordAnswerId);
        });
        // 立即注册, -------------------------------------------
        $('#submit').click(function () {
            _this.submitEvent();
        });
        $('#testFinal').click(function () {
            console.log(funcs.access);
        });


    },
    // 验证用户名合法性
    usernameValidFinal          : function () {
        funcs.access[0] = false;
        var itemId      = 'username';
        var username    = funcs.getFormDate().username;
        // 验证用户名格式是否合法
        var result      = _user.usernameValid(username);
        // 格式不合法
        if (!result.status) {
            funcs.errAlertFunc(itemId, result.msg);
            funcs.submitVerify();
            return;
        }
        // 格式合法后校验接口
        if (result.status) {
            // 接口校验 confirm是个布尔
            _user.checkUsernameDuplicate(username, function (res) {
                // 校验成功
                funcs.sucFunc(funcs.usernameId);
                funcs.access[0] = true;
                funcs.ajaxReady.username = 1;
                // todo
                funcs.submitVerify();

            }, function (err) {
                // 校验失败
                funcs.errAlertFunc(itemId, err);
                funcs.access[0] = false;
                funcs.submitVerify();
            });
        }
        // 是否允许点击注册按钮
        funcs.submitVerify();
        return username;
    },
    // 校验密码合法性
    passwordValidFinal          : function () {
        // 清空之前状态
        funcs.access[1] = false;
        // 定义标签Id
        var passwordId = funcs.passwordId;
        var passwordConfirmId = funcs.passwordConfirmId;
        // 获取值
        var passwordVal = funcs.getFormDate().password;
        var passConfirmVal = funcs.getFormDate().passwordConfirm;
        // 验证面格式是否合法
        var result = _user.passwordValid(passwordVal);
        // 格式不合法
        if (!result.status) {
            funcs.errAlertFunc(passwordId, result.msg);
            funcs.submitVerify();
            return;
        }
        // 合法后判断和确认栏是否相等
        if (passConfirmVal) {
            // 输入了确认密码后更改密码
            if (passwordVal === passConfirmVal) {
                funcs.sucFunc(passwordConfirmId);
                funcs.sucFunc(passwordId);
                funcs.access[1] = true;
                funcs.submitVerify();
                return passwordVal;
            } else {
                funcs.errAlertFunc(passwordConfirmId, '密码不匹配');
                return;
            }
        } else {
            // 如果没输入确认密码直接显示成功
            funcs.sucFunc(passwordId);
            return;
        }
    },
    passwordConfirmValidFinal   : function () {
        // 清空之前状态
        funcs.access[1] = false;
        var passwordId = funcs.passwordId;
        var passwordConfirmId = funcs.passwordConfirmId;

        var passwordVal = funcs.getFormDate().password;
        var passwordConfirmVal = funcs.getFormDate().passwordConfirm;

        if (!passwordVal) {
            // 如果没输入密码, 提示输入密码
            $('#password').focus();
            funcs.errAlertFunc(passwordId, '请先输入密码');
            return;
        }
        if (!(passwordVal === passwordConfirmVal)) {
            funcs.errAlertFunc(passwordConfirmId, "密码不匹配");
            return;
        }
        funcs.sucFunc(passwordConfirmId);
        funcs.sucFunc(passwordId);
        funcs.access[1] = true;
        funcs.submitVerify();
        // 是否允许点击注册按钮

        return passwordConfirmVal;

    },
    phoneValidFinal             : function () {
        // 清空之前状态
        funcs.access[2] = false;
        var phoneId = funcs.phoneNumberId;
        var phoneVal = funcs.getFormDate().phoneNumber;
        // 非空验证
        if (!phoneVal) {
            funcs.errAlertFunc(phoneId, "手机号不能为空");
            return;
        }
        // 格式验证
        if (!_mm.validate(phoneVal, "phone")) {
            funcs.errAlertFunc(phoneId, "手机号格式不正确");
            return;
        }
        funcs.sucFunc(phoneId);
        funcs.access[2] = true;
        // 是否允许点击注册按钮
        funcs.submitVerify();
        return phoneVal;
    },
    emailValidFinal             : function () {
        // 清空之前状态
        funcs.access[3] = false;
        var emailId = funcs.emailId;
        var emailVal = funcs.getFormDate().email;
        // 非空验证
        if (!emailVal) {
            funcs.errAlertFunc(emailId, "邮箱不能为空");
            return;
        }
        // 格式验证
        if (!_mm.validate(emailVal, "email")) {
            funcs.errAlertFunc(emailId, "邮箱格式不正确");
            return;
        }
        // 接口验证
        _user.checkEmailDuplicate(emailVal,function () {

            funcs.sucFunc(emailId);
            funcs.access[3] = true;
            funcs.ajaxReady.email = 1;
            funcs.submitVerify();
        },function (err) {
            funcs.errAlertFunc(emailId, err);
            funcs.submitVerify();
        });
        return emailVal;
    },
    passwordQuestionValidFinal  : function () {
        // 清空之前状态
        funcs.access[4] = true;
        var passQuestId = funcs.passwordQuestionId;
        var passQuestVal = funcs.getFormDate().passwordQuestion;
        var passAnsrVal = funcs.getFormDate().passwordAnswer;
        // 格式验证
        if (!_mm.validate(passQuestVal, "passwordQuestion")) {
            funcs.errAlertFunc(passQuestId, "密码提示问题过长");
            funcs.access[4] = false;
            funcs.submitVerify();
            return;
        }
        // 如果有答案没问题
        if (passAnsrVal && !passQuestVal) {
            funcs.errAlertFunc(passQuestId, "请输入密码提示问题");
            funcs.access[4] = false;
            funcs.submitVerify();
            return;
        }
        // 如果有问题没答案
        if (!passAnsrVal && passQuestVal) {
            funcs.access[5] = false;
            funcs.submitVerify();
            return;
        }
        // 如果密码答案和问题都没有数据
        if (!passQuestVal && !passAnsrVal) {
            funcs.sucFunc(passQuestId);
            funcs.sucFunc(funcs.passwordAnswerId);
            funcs.access[4] = true;
            funcs.access[5] = true;
            funcs.submitVerify();
        }
        // 如果答案问题都有
        if (passQuestVal && passAnsrVal) {
            funcs.sucFunc(passQuestId);
            funcs.sucFunc(funcs.passwordAnswerId);
            funcs.access[4] = true;
            funcs.access[5] = true;
            funcs.submitVerify();
        }
        funcs.sucFunc(passQuestId);
        funcs.access[4] = true;
        // 是否允许点击注册按钮
        funcs.submitVerify();
        return passQuestVal;
    },
    passwordAnswerValidFinal    : function () {
        // 清空之前状态
        funcs.access[5] = true;
        var passwordAnswerId = funcs.passwordAnswerId;
        var passwordQuestionId = funcs.passwordQuestionId;
        var passwordQuestionVal = funcs.getFormDate().passwordQuestion;
        var passwordAnswerVal = funcs.getFormDate().passwordAnswer;
        // 格式验证
        if (!_mm.validate(passwordQuestionVal, "passwordQuestion")) {
            funcs.errAlertFunc(passwordAnswerId, "密码提示答案过长");
            funcs.access[5] = false;
            return;
        }
        // 如果有问题而没答案
        if (passwordQuestionVal && !passwordAnswerVal) {
            funcs.errAlertFunc(passwordAnswerId, "请输入密码提示答案");
            funcs.access[5] = false;
            funcs.submitVerify();
            return;
        }
        // 如果有答案没问题
        if (!passwordQuestionVal && passwordAnswerVal) {
            funcs.errAlertFunc(passwordQuestionId, "请输入密码提示问题");
            $('#'+passwordQuestionId).focus();
            funcs.access[5] = false;
            return;
        }
        // 如果密码答案和问题都没有数据
        if (!passwordQuestionVal && !passwordAnswerVal) {
            funcs.access[4] = true;
            funcs.access[5] = true;
            funcs.sucFunc(passwordAnswerId);
            funcs.sucFunc(funcs.passwordQuestionId);
        }
        // 如果都有数据
        if (passwordQuestionVal && !passwordAnswerVal) {
            funcs.access[4] = true;
            funcs.access[5] = true;
            funcs.sucFunc(passwordAnswerId);
            funcs.sucFunc(funcs.passwordQuestionId);
        }
        funcs.access[5] = true;
        funcs.sucFunc(passwordAnswerId);
        // 是否允许点击注册按钮
        funcs.submitVerify();
        return passwordAnswerVal;
    },
    submitEvent                 : function () {
        // 初始化access
        funcs.access = [false, false, false, false, true, true];
        var userInfo = {};
        var username = this.usernameValidFinal();
        var password = this.passwordValidFinal();
        var passwordConfirm = this.passwordConfirmValidFinal();
        var phone = this.phoneValidFinal();
        var email = this.emailValidFinal();
        var passQ = this.passwordQuestionValidFinal();
        var passA = this.passwordAnswerValidFinal();
        var access = funcs.access;



        // 开启计时器,等待异步就绪, 每1秒尝试一次验证信息
        clearInterval(caches.timer);
        caches.timer =window.setInterval(function () {
            for (var x =0, xLength=access.length;x<xLength;x++) {
                if (!access[x]) {
                    return;
                }
            }
            // 如果通行许可全部通过则允许注册
            funcs.disabledAll();
            userInfo.username   = username;
            userInfo.password   = password;
            userInfo.phone      = phone;
            userInfo.email      = email;
            userInfo.question   = passQ;
            userInfo.answer     = passA;
            // 如果超过最大重试次数, 则提示超时, 重新刷新页面
            if (funcs.retryTimesCurrent > funcs.retryTimesMax) {
                window.clearInterval( caches.timer);
                funcs.retryTimesCurrent = 0;
                _alert.show("注册超时, 请重新尝试");
                setTimeout(function () {
                    window.location.reload();
                },1500);
            }
            // 重试次数+1
            funcs.retryTimesCurrent++;
            // 确认回调状态
            if (funcs.ajaxReady.username===1 && funcs.ajaxReady.email===1) {
                // 再次确认传输许可
                for (var i =0, iLength = funcs.access.length;i<iLength;i++) {
                    if (!funcs.access[i]) {
                        return;
                    }
                }
                // 调用接口注册
                _user.register(userInfo,function () {
                    window.location.href = './result.html?type=register'
                },function (err) {
                    window.location.href = './result.html?type=registerFail';
                    _alert.show(err.status || err);
                });
            }
        },1000);
    },

};
register.init();