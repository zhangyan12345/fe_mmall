require('./index.css');
require('page/common/nav-simple/index.js');
var _mm = require('util/mm.js');

var result = {
    init            :function(){
        this.messagePage();
        this.orderPage();
    },
    messagePage     : function () {
        // 提取传参的类型, 选取时候进行拼接并显示对应的提示模块
        var type = _mm.getUrlParam('type') || 'default';
        var $element = $('.' + type);
        $element.show();
        // 背景角色图
        $('.character-img').show();
    },
    orderPage       : function () {

    }
};

result.init();