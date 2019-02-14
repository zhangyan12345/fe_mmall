var _mm = require('util/mm.js');
var _user = {
    // 检查登录状态
    checkLogin      :function (resolve, reject) {
        _mm.request({
            url: _mm.getServerUrl('/user/get_user_info.do'),
            method  :   'POST',
            // 接受一个方法
            success :   resolve,
            // 接受一个方法
            error   :   reject
        })
    },
    // 同步验证
    checkLoginSyc:function (callBackFuncSuc,callBackError) {

        var result = 0;
        _mm.request({
            url: _mm.getServerUrl('/user/get_user_info.do'),
            method: 'POST',
            async: false,
            // 接受一个方法
            success: function () {
                if (callBackFuncSuc) {
                    typeof callBackFuncSuc === 'function' && callBackFuncSuc();
                }
                result = true;
            },
            // 接受一个方法
            error: function () {
                if (callBackError) {
                    typeof callBackError === 'function' && callBackError();
                }
                result = false;
            },
        });
        return result;
    },
    register      :function (userInfo,resolve, reject) {
        _mm.request({
            url     : _mm.getServerUrl('/user/register.do'),
            method  :   'POST',
            data    : userInfo,
            // 接受一个方法
            success :   resolve,
            // 接受一个方法
            error   :   reject
        })
    },
    // 登出
    logOut          :function (resolve, reject) {
        _mm.request({
            url: _mm.getServerUrl('/user/logout.do'),
            method  :   'POST',
            // 接受一个方法
            success :   resolve,
            // 接受一个方法
            error   :   reject
        })
    },
    login           :function (userInfo, resolve, reject) {
        _mm.request({
            url: _mm.getServerUrl('/user/login.do'),
            data: userInfo,
            method  :   'POST',
            // 建立成功回调链接
            success :   resolve,
            // 建立失败回调链接
            error   :   reject
        })
    },
    // username输入格式验证
    usernameValid   : function (username) {
        // 校验之前先初始化false
        var result = {
            status: false,
            msg: ''
        };
        if (!username) {
            result.msg = '用户名不能为空';
            return result;
        }
        // 判断是否有特殊字符
        var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]");
        if (pattern.exec(username.toString())) {
            result.msg = '含有特殊字符';
            return result;
        }
        pattern = new RegExp("^[0-9]");
        // 判断是否数字开头
        if (pattern.test(username)) {
            result.msg = '无法以数字开头';
            return result;
        }
        // 判断是否过短
        if (username.length < 4) {
            result.msg = '用户名过短';
            return result;
        }
        // 用户名过长
        if (username.length > 16) {
            result.msg = '用户名过长';
            return result;
        }
        // 禁止有汉字
        if (/[^\w\.\/]/ig.test(username)) {
            result.msg = '禁止输入汉字';
            return result;
        }
        result.status = true;
        return result;

    },
    passwordValid   :function(password){
        var result = {
            status:false,
            msg:''
        };
        // 非空
        if (!password) {
            result.msg = '密码不能为空';
            return result;
        }
        // 判断是否有特殊字符
        var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]");
        if (pattern.exec(password.toString())) {
            result.msg = '含有特殊字符';
            return result;
        }
          pattern = new RegExp("^[0-9].+");
        // 判断是否数字开头
        if (pattern.test(password)) {
            result.msg = '无法以数字开头';
            return result;
        }
        // 判断是否过短
        if (password.length < 7) {
            result.msg = '密码过短, 请输入6-20位密码';
            return result;
        }
        if (password.length > 20) {
            result.msg = '密码过长, 请输入6-20位密码';
            return result;
        }
        // 禁止有汉字
        if (/[^\w\.\/]/ig.test(password)) {
            result.msg = '请勿使用汉字';
            return result;
        }
        result.status = true;
        return result;

    },
    checkUsernameDuplicate: function (username, resolve,reject) {
       _mm.request({
            url: _mm.getServerUrl('/user/check_valid.do'),
            data: {
                str:username,
                type:'username'
            },
            method: 'POST',
            // 建立成功回调链接
            success: resolve,
            // 建立失败回调链接
            error: reject
        });
        return reject;
    },
    checkUsernameExist: function (username, resolve,reject) {
       _mm.request({
            url: _mm.getServerUrl('/user/check_valid.do'),
            data: {
                str:username,
                type:'username'
            },
            method: 'POST',
            // 建立成功回调链接
            success: resolve,
            // 建立失败回调链接
            error: reject
        });
        return reject;
    },
    checkEmailDuplicate: function (email, resolve,reject) {
        _mm.request({
            url: _mm.getServerUrl('/user/check_valid.do'),
            data: {
                str:email,
                type:'email'
            },
            method: 'POST',
            // 建立成功回调链接
            success: resolve,
            // 建立失败回调链接
            error: reject
        });
    },
    getQuestion:function (username, resolve, reject) {
        _mm.request({
            url:_mm.getServerUrl('/user/forget_get_question.do'),
            data:{username:username},
            method:'POST',
            success:resolve,
            error:reject
        })
    },
    checkAnswer:function (data,resolve,reject) {
        _mm.request({
            url:_mm.getServerUrl('/user/forget_check_answer.do'),
            data:data,
            method:'POST',
            success:resolve,
            error:reject
        })
    },
    resetPassword:function (data,resolve,reject) {
        _mm.request({
            url:_mm.getServerUrl('/user/forget_reset_password.do'),
            data:data,
            method:'POST',
            success:resolve,
            error:reject
        })
    },
    getUserInfo:function (resolve,reject) {
        _mm.request({
            url:_mm.getServerUrl('/user/get_information.do'),
            method:'POST',
            success:resolve,
            error:reject
        })
    },
    updateUserinfo:function (userInfo, resolve, reject) {
        _mm.request({
            url:_mm.getServerUrl('/user/update_information.do'),
            data:userInfo,
            method:'POST',
            success:resolve,
            error:reject
        })
    },
    updateUserPass:function (userInfo, resolve, reject) {
        _mm.request({
            url:_mm.getServerUrl('/user/reset_password.do'),
            data:userInfo,
            method:'POST',
            success:resolve,
            error:reject
        })
    }
};
module.exports = _user;