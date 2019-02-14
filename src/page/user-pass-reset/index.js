/*
 * @Author: Avenda
 * @Date: 2018/10/5
 */

require('./index.css');
require('util/mm.js');
require('common/nav-simple/index.js');
var _alert          = require('common/alert-window/index.js');
var verifyPlug      = require('util/vertifyFunc.js');
var tools           = require('util/tools.js');
var _user           = require('service/user-service.js');
// 常量池
var consts          = {
    componentUsername               :   '.username-input',
    componentPassAnswer             :   '.password-answer',
    componentPassNew                :   '.password-new',
    submitUsername                  :   '#submit-username',
    submitPassAnswer                :   '#submit-pass-answer',
    submitPassNew                   :   '#submit-passwordNew',
    valUsername                     :   '#username',
    valPassAnswer                   :   '#pass-answer',
    valPassNew                      :   '#password',
    valPassNewConfirm               :   '#pass-confirm',
    valPassQuest                    :   '#pass-quest',
};
// 缓存变量
var cache           = {
    timer                   :undefined,
    access                  : false,
    username                :'',
    question                :'',
    answer                  :'',
    token                   :'',
    stepSwitch              :0,
    passNew                 :'',
    passNewConfirm          :'',
};
// 功能池
var mfuncs          = {
    // 加载用户名输入页面
    showUsernameComponent     :function () {
        cache.access = false;
        $(consts.componentUsername).fadeIn(200);
    },
    // 加载密码问题页面
    showPassAnswerComponent   :function () {
        cache.access = false;
        $(consts.componentUsername).hide().siblings(consts.componentPassAnswer).fadeIn(200);

    },
    // 加载新密码输入页面
    showPassNewComponent      :function () {
        cache.access = false;
        $(consts.componentPassAnswer).hide().siblings(consts.componentUsername).hide().siblings(consts.componentPassNew).fadeIn(200);
    },
    clearCache                :function () {
        cache= {
            timer           :undefined,
            access          : false,
            username        :'',
            question        :'',
            answer          :'',
            token           :'',
            stepSwitch      :0,
            passNew         :'',
            passNewConfirm  :'',
        };
    },
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
    // 是否允许submit提交
    submit:function(submitItem,status) {
        var $element = $(submitItem);
        if (!status) {
            $element.attr("disabled", "disabled");
        } else {
            $element.removeAttr("disabled");
        }
        return this;
    },


};
// 验证功能池
var mfuncsVerify    = {
    // 用户名校验
    usernameValid       :function () {
      var username  = $.trim($(consts.valUsername).val());
      var result    = verifyPlug.commonValid(username,"username");
      // 格式不合法
      if (!result.status) {
          mfuncs.errAlertFunc(consts.valUsername,result.msg);
          return;
      }
      // 格式合法, 调用接口认证
      _user.checkUsernameExist(username,function () {
          mfuncs.errAlertFunc(consts.valUsername,"用户名未找到");
          cache.access = false;
          mfuncs.submit(consts.submitUsername, false);

      },function (err) {
          cache.access = true;
          cache.username = username;
          mfuncs.submit(consts.submitUsername, true);
          mfuncs.sucAlertFunc(consts.valUsername);
      });
  },
    // 检查答案格式
    checkAnswerFormat   :function () {
        var answer = $.trim($(consts.valPassAnswer).val());
        var result = verifyPlug.commonValid(answer, "passResetAnswer");
        if (!result.status) {
            mfuncs.errAlertFunc(consts.valPassAnswer, result.msg);
            mfuncs.submit(consts.submitPassAnswer, false);
            return false;
        }
        cache.answer = answer;
        mfuncs.sucAlertFunc(consts.valPassAnswer);
        mfuncs.submit(consts.submitPassAnswer, true);
        return true;
    },
    // 新密码格式检查
    passwordNewCheck    :function () {
        var passConfirm = $.trim($(consts.valPassNewConfirm).val());
        var passNew     = $.trim($(consts.valPassNew).val());
        var result      = verifyPlug.passwordValid(passNew);
        console.log(result);
        if (!result.status) {
            mfuncs.errAlertFunc(consts.valPassNew, result.msg);
            return false;
        }
        if (!(passNew === passConfirm) && passConfirm) {
            mfuncs.errAlertFunc(consts.valPassNew, "密码不匹配");
            mfuncs.sucAlertFunc(consts.valPassNewConfirm);
            return false;
        }
        cache.passNew = passNew;
        mfuncs.sucAlertFunc(consts.valPassNew);
        mfuncs.sucAlertFunc(consts.valPassNewConfirm);
        return true;
    },
    // 新密码确认格式检查
    passNewConfirmCheck :function () {
        var passConfirm = $.trim($(consts.valPassNewConfirm).val());
        var passNew     = $.trim($(consts.valPassNew).val());
        if (!passConfirm) {
            mfuncs.errAlertFunc(consts.valPassNewConfirm, "请再次输入密码");
            return false;
        }
        if (passNew &&!(passNew === passConfirm) ) {
            mfuncs.errAlertFunc(consts.valPassNewConfirm, "密码不匹配");
            mfuncs.sucAlertFunc(consts.valPassNew);
            return false;
        }

        cache.passNew = passConfirm;
        mfuncs.sucAlertFunc(consts.valPassNew);
        mfuncs.sucAlertFunc(consts.valPassNewConfirm);
        return true;
    }
};
// 主逻辑
var userPassReset   = {
    init            :function () {
        this.onLoad();
        this.bindEvent();
        $(consts.valUsername).focus();
    },
    bindEvent       :function () {
        // 延迟获得数据
        tools.delayGet(consts.valUsername, mfuncsVerify.usernameValid);
        tools.delayGet(consts.valPassNew, mfuncsVerify.passwordNewCheck);
        tools.delayGet(consts.valPassNewConfirm, mfuncsVerify.passNewConfirmCheck);
        // 用户输入时候禁用提交
        $(consts.valUsername).keydown(function (e) {
            mfuncs.submit(consts.submitUsername, false);
        }).keyup(function (e) {
            if (e.keyCode === 13) {
                $(consts.submitUsername).click();
            }
        });
        // 密码答案输入框
        $(consts.valPassAnswer).keyup(function (e) {
            mfuncsVerify.checkAnswerFormat();
            if (e.keyCode === 13) {
                $(consts.submitPassAnswer).click();
            }
        });
        // 提交用户名
        $(consts.submitUsername).click(function () {
            if (cache.access) {
                // 拿到密码提示问题
                _user.getQuestion(cache.username, function (res) {
                    $(consts.valPassQuest).text(res);
                    cache.question = res;
                    mfuncs.showPassAnswerComponent();
                    $(consts.valPassAnswer).focus();
                }, function (err) {
                    if (err.status !== 404) {
                        mfuncs.showPassNewComponent();
                    } else {
                        _alert.show("与服务器连接失败");
                    }
                });
            }
        });
        // 提交密码提示答案
        $(consts.submitPassAnswer).click(function () {
            if (!mfuncsVerify.checkAnswerFormat()) {
                return;
            }
            // 合法
            _user.checkAnswer({
                username:cache.username,
                question:cache.question,
                answer  : cache.answer
            },function (res) {
                cache.token = res;
                cache.access = true;
                console.log(cache);
                mfuncs.showPassNewComponent();
                $(consts.valPassNew).focus();
            },function (err) {
                console.log(err);
                if (err.status !== 404) {
                    mfuncs.errAlertFunc(consts.valPassAnswer, err);
                } else {
                    _alert.show("与服务器连接失败");
                }

            });

        });
        // 最终提交
        $(consts.submitPassNew).click(function () {
            if (mfuncsVerify.passwordNewCheck() && mfuncsVerify.passNewConfirmCheck()) {
                _user.resetPassword({
                    username        :cache.username,
                    passwordNew     :cache.passNew,
                    forgetToken     : cache.token
                },function (data, msg) {
                    // 修改成功
                    // 清理缓存
                    mfuncs.clearCache();
                    // 跳转
                    window.location.href = './result.html?type=pass-rest-suc';
                },function (err) {
                    if (err.status === 404) {
                        _alert.show("与服务器连接失败");
                    }
                    // 注册失败
                    // 清理缓存
                    mfuncs.clearCache();
                });
            }
        });
    },
    onLoad          : function () {
        mfuncs.clearCache();
        mfuncs.showUsernameComponent();
    }
};
userPassReset.init();