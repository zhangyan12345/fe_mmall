/*
 * @Author: Avenda
 * @Date: 2018/10/5
 */

var vertifyFunc = {
    usernameValid           : function (username) {
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
    passwordValid           : function (password) {
        var result = {
            status: false,
            msg: ''
        };
        // 非空
        if (!password) {
            result.msg = '密码不能为空';
            return result;
        }
        // 禁止有汉字
        if (/[^\w\.\/]/ig.test(password)) {
            result.msg = '请勿使用汉字';
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

        result.status = true;
        return result;

    },
    commonValid             : function (value, type, noCheckBlank) {
        var result = {
            status: false,
            msg: ''
        };
        switch (type) {
            case 'password':
                if (!value) {
                    result.msg = "密码不能为空";
                } else {
                    result.status = true;
                    result.msg = "密码通过";
                }
                return result;
            case 'username':
                if (!value) {
                    result.msg = "用户名不能为空";
                } else {
                    result.status = true;
                }
                return result;
            case 'phone':
                // 非空验证
                if (!noCheckBlank && !value) {
                    result.msg = "手机号不能为空";
                    return result;
                }
                if (noCheckBlank && !value) {
                    result.status = true;
                    return result;
                }
                // 手机号格式验证
                if (/^1\d{10}$/.test(value)) {
                    result.status = true;
                    return result;
                }
                result.msg = "手机号格式错误";
                return result;
            case 'email':
                var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
                if (!noCheckBlank && !value) {
                    result.msg = "邮箱不能为空";
                    return result;
                }
                if (noCheckBlank && !value) {
                    result.status = true;
                    return result;
                }
                if (reg.test(value)) {
                    result.status = true;
                    return result;
                }
                result.msg = "邮箱格式错误";
                return result;
            case 'passwordQuestion':
                if (value.length < 21 || !value) {
                    result.status = true;
                } else {
                    result.msg = "密码提示答案长度错误"
                }
                return result;
            case 'passwordAnswer':
                if (value.length < 21 || !value) {
                    result.status = true;
                } else {
                    result.msg = "密码提示答案长度错误"
                }
                return result;
            case 'passResetAnswer':
                if (!value) {
                    result.msg = "答案不能为空";
                    return result;
                } else {
                    result.status = true;
                    return result;
                }
            default:
                result.msg = "验证字段传输错误";
                return result;
        }

    },
    questionValid           : function (questionId, answerId) {
        // 清空之前状态
        var result = {status: false, msg: ''};
        var passQuestVal = $.trim($(questionId).val());
        var passAnsrVal =$.trim($(answerId).val());
        // 格式验证
        if (passQuestVal.length > 21) {
            result.msg = '密码提示问题过长';
            return result;
        }
        // 如果有问题没答案
        if (!passAnsrVal && passQuestVal) {
            result.msg = '请输入问题密码提示答案';
            return result;
        }
        // 如果密码答案和问题都没有数据
        if (!passQuestVal && !passAnsrVal) {
            result.status = true;
            return result;
        }
        // 如果答案问题都有
        if (passQuestVal && passAnsrVal) {
            result.status = true;
            return result;
        }
        result.msg = '未知错误';
        return result;
    },
    passwordAnswerValid     : function (questionId, answerId) {
        // 清空之前状态
        var result = {status: false, msg: ''};
        var passQuestVal = $.trim($(questionId).val());
        var passAnsrVal =$.trim($(answerId).val());
        // 格式验证
        if (passQuestVal.length > 21) {
            result.msg = '密码提示答案过长';
            return result;
        }

        // 如果有问题没答案
        if (!passAnsrVal && passQuestVal) {
            result.msg = '请输入问题密码提示答案';
            return result;
        }

        // 如果密码答案和问题都没有数据
        if (!passQuestVal && !passAnsrVal) {
            result.status = true;
            return result;
        }
        // 如果答案问题都有
        if (passQuestVal && passAnsrVal) {
            result.status = true;
            return result;
        }

        result.msg = '未知错误';
        return result;
    },
    passWithConfirm         :function (passId,confirmId,sucFunc,errFunc) {
        // 获取值
        var passwordVal = $.trim($(passId).val());
        var passConfirmVal = $.trim($(confirmId).val());
        // 验证面格式是否合法
        var result =this.passwordValid(passwordVal);
        // 格式不合法
        if (!result.status) {
           errFunc(passId, result.msg);
            return false;
        }
        // 合法后判断和确认栏是否相等
        if (passConfirmVal) {
            // 输入了确认密码后更改密码
            if (passwordVal === passConfirmVal) {
                sucFunc(confirmId);
                sucFunc(passId);
                return true;
            } else {
                errFunc(passId, '密码不匹配');
                return false;
            }

        } else {
            // 如果没输入确认密码直接显示成功
            sucFunc(passId);
            return false;
        }

    },
    confirmWithPass         :function (passId, confirmId, sucFunc, errFunc) {
        var passwordVal = $.trim($(passId).val());
        var passwordConfirmVal =  $.trim($(confirmId).val());

        if (!passwordVal) {
            // 如果没输入密码, 提示输入密码
            $('#password').focus();
            errFunc(passId, '请先输入密码');
            sucFunc(confirmId);
            return false;
        }

        if (!(passwordVal === passwordConfirmVal)) {
            errFunc(confirmId, "密码不匹配");
            return false;
        }

        sucFunc(confirmId);
        sucFunc(passId);
        return true;
    }
};
module.exports = vertifyFunc;