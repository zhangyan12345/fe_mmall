/*
 * @Author: Avenda
 * @Date: 2018/10/6
 */

require('./index.css');
var cache = {
    keyForbid: true,
};
var alertWindow = {

    init            :function () {
        this.bindEvent();

    },
    bindEvent       :function () {
        $("#open-alert").click(function () {
            $('.alert-window').show();

            // 禁用键盘
            cache.keyForbid = false;

        });

        $("#close").click(function () {
            $('.alert-window').hide();

            // 开启键盘
            cache.keyForbid = true;
        });

    },
    show            :function (contentSub,content) {
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
    return  cache.keyForbid;
};
document.oncontextmenu = function () {
    return  cache.keyForbid;
};
module.exports = alertWindow;
