/*
 * @Author: Avenda
 * @Date: 2018/10/6
 */

require('./index.css');
var alert_cache = {
    keyForbid: true,
    callbackFunc:''
};
var alertWindow = {

    init            :function () {
        this.bindEvent();

    },
    bindEvent       :function () {
        $("#open-alert").click(function () {
            $('.alert-window').removeClass("hide").addClass("show");

            // 禁用键盘
            alert_cache.keyForbid = false;

        });

        $("#close").click(function () {
            $('.alert-window').removeClass("show").addClass("hide");

            // 开启键盘
            alert_cache.keyForbid = true;
            // 如果有回调方法调用回调方法
            if (alert_cache.callbackFunc) {
                alert_cache.callbackFunc();
            }
        });

    },
    show            :function (contentSub,content,callBackFunc) {
        // 缓存回调方法
        alert_cache.callbackFunc = callBackFunc;
        if (content) {
            $("#alert-window-content").text(content);
        }
        if (contentSub) {
            $("#alert-window-content-sub").text(contentSub);
        }
        $("#open-alert").click();

    },
};
alertWindow.init();
document.onkeydown = function () {
    return  alert_cache.keyForbid;
};
document.oncontextmenu = function () {
    return  alert_cache.keyForbid;
};
module.exports = alertWindow;
