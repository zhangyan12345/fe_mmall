/*
 * @Author: Avenda
 * @Date: 2018/10/6
 */

require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
require('page/common/nav-side/index.js');

var _navside            = require('page/common/nav-side/index.js');
var _mm                 = require('util/mm.js');
var _user               = require('service/user-service.js');
var _alert              = require('page/common/alert-window');
var _tools              = require('util/tools.js');
var template            = require('./index.string');
var _vertify            = require('util/vertifyFunc.js');
// 常量池
var consts      = {
    valPanelContent     :'#panel-content',
    valPhone            : '#phoneNew',
    valEmail            : '#email',
    submitPersonal      :'#submit',
    valUpdateQuestion   :'#question',
    valUpdateAnswer     :'#answer'
};
// 缓存池
var cache       = {
    phone               : '',
    email               : '',
    questionAccess      :true,
    question            :'',
    answer              :''
};
// 功能池
var mfuncs      = {};
// 主逻辑
var userCenter  = {
    init                    :function () {
        this.checkUserLogin();
        this.loadUserInfo();

    },
    bindEvent               :function () {
        var _this = this;
        $(consts.valPhone).blur(function () {
            _this.checkPhone();
        });
        $(consts.valEmail).blur(function () {
            _this.checkEmail();
        });
        $(consts.submitPersonal).click(function () {
            _this.submit();
        });

    },
    // 加载用户信息, 加载完毕后初始化事件
    loadUserInfo            :function () {
        var _this = this;
        var userHtml = '';
        // 获取用户信息
        _user.getUserInfo(function (res) {
            userHtml = _mm.renderHtml(template,res);
            $(consts.valPanelContent).html(userHtml);
            _this.bindEvent();
            // 如果有密码就禁用修改密码问题
            if (res.question) {
                // 如果密码提示已经设置则关闭修改通道
                _this.closeQuestion();
            } else {
                // todo
                // 开启密码修改通道
                _tools.sucAlertFunc(consts.valUpdateQuestion);
                _tools.sucAlertFunc(consts.valUpdateAnswer);
            }
        },function (err) {
            if (err.status === 404) {
                _alert.show("与服务器连接失败");
            } else {
                _mm.doLogin();
            }
        });
    },
    // 页面加载检查登录状态
    checkUserLogin          :function () {
        var _this = this;
        _user.checkLogin(function (res) {

        },function (err) {
            _mm.doLogin();
        });
    },
    checkPhone              :function () {
        var phone = $.trim($(consts.valPhone).val());
        var result = _vertify.commonValid(phone, "phone",true);
        if (!result.status) {
            _tools.errAlertFunc(consts.valPhone,result.msg);
            return false;
        }
        _tools.sucAlertFunc(consts.valPhone);
        cache.phone = phone;
        return true;
    },
    checkEmail              :function () {
        var email = $.trim($(consts.valEmail).val());
        var result = _vertify.commonValid(email, "email",true);
        if (!result.status) {
            _tools.errAlertFunc(consts.valEmail,result.msg);
            return false;
        }
        _tools.sucAlertFunc(consts.valEmail);
        cache.email = email;
        return true;
    },
    // 问题验证
    checkQuestion           : function(){
        var question = $.trim($(consts.valUpdateQuestion).val());
        var result = _vertify.questionValid(consts.valUpdateQuestion,consts.valUpdateAnswer);
        if (!result.status) {
            console.log(result);
            _tools.errAlertFunc(consts.valUpdateQuestion,result.msg);
            return false;
        }
        _tools.sucAlertFunc(consts.valUpdateQuestion);
        cache.question = question;
        return true;
    },
    // 答案验证
    checkAnswer             : function(){
        // 提取答案
        var answer = $.trim($(consts.valUpdateAnswer).val());
        // 提取答案
        var result = _vertify.passwordAnswerValid(consts.valUpdateQuestion,consts.valUpdateAnswer);
        console.log(result);
        if (!result.status) {
            _tools.errAlertFunc(consts.valUpdateAnswer,result.msg);
            return false;
        }
        _tools.sucAlertFunc(consts.valUpdateAnswer);
        cache.answer = answer;
        return true;
    },
    closeQuestion           :function(){
        // 禁用input, 提交许可设为false
        $(consts.valUpdateQuestion).attr("disabled", "disabled");
        $(consts.valUpdateAnswer).attr("disabled", "disabled");
        // 关闭密码提示问题修改通道
        cache.questionAccess = false;
    },
    submit                  :function () {

        var finalResult = false;
        console.log(this.checkAnswer() );
        // 如果开启了密码提示, 则校验密码提示
        if (cache.questionAccess) {
            finalResult =this.checkEmail() && this.checkPhone() && this.checkQuestion() && this.checkAnswer();
        } else {
            finalResult = this.checkEmail() && this.checkPhone();
        }

        // 提交
        if (finalResult) {
            var userinfo = {
            };

            // 如果email有值就加入到userinfo中
            if (cache.email) {
                userinfo.email = cache.email;
            }
            // 如果phone有值就加入到userinfo中
            if (cache.phone) {
                userinfo.phone = cache.phone;
            }

            // 如果question有值就加入到userinfo中
            if (cache.question) {
                userinfo.question = cache.question;
            }
            // 如果answer有值就加入到userinfo中
            if (cache.answer) {
                userinfo.answer = cache.answer;
            }
            if (JSON.stringify(userinfo) === '{}') {
                _alert.show("无变更");
                return;
            }

            // 验证邮箱是否可以使用
            _user.checkEmailDuplicate(userinfo.email,function (res) {
                // 邮箱验证成功进入提交流程
                _user.updateUserinfo(userinfo,function (res) {
                    _alert.show("个人信息修改成功","^_^");
                    // 3秒后自动跳转
                    setTimeout(function () {
                        window.location.href = './user-center.html'
                    },2000)
                },function (err) {
                    _alert.show(err);
                });
            },function (err) {
                // email校验失败
                _tools.errAlertFunc(consts.valEmail,err);
            });
        }
    }
};

// 初始化左侧信息

_navside.init("user-center");
userCenter.init();