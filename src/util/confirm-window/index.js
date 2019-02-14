/*
 * @Author: Avenda
 * @Date: 2018/10/6
 */

require('./index.css');


var cfm_consts          = {
    // 通用模块
    window:$('.confirm-window'),
    closeBtn:$('#confirm-close'),
    openBtn:$('#confirm-open-alert'),
    // 自定义模块
    content:$('.content .context'),
    cancel:$('.oper-item.cancel'),
    ensure:$('.oper-item.ensure')

};
var cfm_cache = {

    sucFunc:''

};
var cfm_funcs          = {

};
var confirmWindow = {

    init            :function () {
        this.bindEvent();

    },
    bindEvent       :function () {
        var _this = this;
        // 打开按钮
        cfm_consts.openBtn.click(function () {
            cfm_consts.window.removeClass("hide").addClass("show");
        });
        // 关闭按钮
        cfm_consts.closeBtn.click(function () {
            cfm_consts.window.removeClass("show").addClass("hide");

        });
        // 取消按钮
        cfm_consts.cancel.click(function () {
            cfm_consts.closeBtn.click();
        });
        // 确定按钮
        cfm_consts.ensure.click(function () {
            // 执行回调函数
            cfm_cache.sucFunc();
            // 关闭
            cfm_consts.closeBtn.click();
            // 清空回调函数
            cfm_cache.sucFunc = '';
        });

    },
    show            :function (text,sucFunc) {
        cfm_consts.content.text(text);
        // 传入调永对象的回调引用
        cfm_cache.sucFunc = sucFunc;
        // 显示窗口
        cfm_consts.openBtn.click();

    },



};
confirmWindow.init();


module.exports = confirmWindow;
