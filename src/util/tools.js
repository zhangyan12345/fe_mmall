/*
 * @Author: Avenda
 * @Date: 2018/10/5
 */
var _mm = require('util/mm.js');
var tools = {
    delayGet:function (itemId, func, delayTime) {
        // 去掉#和.前缀
        var element = document.getElementById(itemId.replace(/^(#|.)/, ""));
        var timer;
        var delay = 250;
        if (delayTime) {
            delay = delayTime;
        }
        // 按下结束计时器
        element.onkeydown = function (e) {
            clearTimeout(timer);
        };
        // 弹起开始计时
        element.onkeyup = function () {

            clearTimeout(timer);
            timer = setTimeout(func, delay);
        };
        element.onblur = function () {
            func();
        };
    },
    asyRetry:function (func,maxRetryTimes) {
        var timer;
        var maxRetry = 20;
        var currentRetry = 0;
        if (maxRetryTimes) {
            maxRetry = maxRetryTimes;
        }
        !function () {
            timer = setTimeout(function () {
                func(timer);
                currentRetry++;
                if (currentRetry>=maxRetry) {
                    clearTimeout(timer);
                }
            }, 300);
        }();
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
    hideStyle                 : function (item) {
        $(item).removeClass('border-suc');
        $(item).removeClass('border-err');
        $((item+"-suc").replace(/#/,".")).hide();
        $((item+"-err").replace(/#/,".")).hide();
    },
    randomGeneric:function (Min,Max) {
            var Range = Max - Min;
            var Rand = Math.random();
            var num = Min + Math.round(Rand * Range); //四舍五入
            return num;
    },
    // ajax同步案例
    checkLoginSyc:function (callBackFuncSuc) {
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
                result = false;
            },
        });
        return result;
    },
    checkLoginAsyc:function (callBackFuncSuc) {
        var result = 0;
        _mm.request({
            url: _mm.getServerUrl('/user/get_user_info.do'),
            method: 'POST',
            // 接受一个方法
            success: function () {
                if (callBackFuncSuc) {
                    typeof callBackFuncSuc === 'function' && callBackFuncSuc();
                }
                result = true;
            },
            // 接受一个方法
            error: function () {
                result = false;
            },
        });
        return result;
    },
};
module.exports = tools;