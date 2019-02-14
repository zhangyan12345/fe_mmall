require('./index.css');
var _mm = require('util/mm.js');
// 通用页面头部
var header = {
    // 初始化功能 ( init )
    init            : function () {
        this.bindEvent();
        // 返回调用者
        this.onLoad();
    },
    // 搜索栏回填, (url加载进来之后, 读取url信息, 然后填充到搜索栏)\
    onLoad          :function(){
        var keyword = _mm.getUrlParam("keyword");
        // 如果keyword存在, 则回调填入搜索框
        if (keyword) {
            $('#search-input').val(keyword);
        }
    },
    bindEvent       :function () {
        // 搜索按钮提交( 因为是jq的选择器, 所以this需要重新赋值一个变量 )
        var _this = this;
        $('#btn-search').click(function () {
            _this.searchSubmit();
        });
        // 回车提交
        $('#search-input').keyup(function (e) {
            if (e.keyCode === 13) {
                _this.searchSubmit();
            }
        });
        // 取消
        $('#focus-me-close').click(function () {
            $('#focus-me').prop("hidden",true);
        });

    },
    // 搜索按钮提交
    searchSubmit    : function () {

        // 取到输入框keyword, 别忘了去空格
        var keyword = $.trim($('#search-input').val());
        // 如果有值就提交, 并跳转到list页
        if (keyword) {
            window.location.href = './list.html?keyword=' + keyword;
        } else {
            // 如果为空, 就直接返回首页
            _mm.gohome();
        }
    },
    showSubtitle           :function (text) {
        $('.header .logo-channel').fadeIn(400);
        $('.header .logo-channel-content').text(text);
    }

};

 header.init();

module.exports = header;