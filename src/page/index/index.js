'use strick';
require('page/common/nav/index.js');
require('page/common/header/index.js');
require('./index.css');
require('util/slider/unslider.min.js');

var _mm                 = require('util/mm.js');
var template            = require('./keywordsTemplate.string');
var _alert               = require('common/alert-window/index.js');

var tempData            = {
    content: [
        {
            id      : 'row1',
            class   : '',
            tagA    : [
                {name   : '手机',    id: 'row1-1',    href:'./list.html?categoryId=100012'},
                {name   : '数码',    id: 'row1-2',    href:'./list.html?categoryId=100002'}
            ]
        },
        {
            id      : 'row2',
            class   : 'keywords-item',
            tagA    : [
                {name: '电脑',    id: 'row2-1',   href:'./list.html?categoryId=100011'},
                {name: '办公配件',   id: 'row2-2',   href:'./list.html?categoryId=100015'}
            ]
        },
        {
            id      : 'row3',
            class   : 'keywords-item',
            tagA    : [
                {name: '电视',    id: 'row3-1',   href:'./list.html?categoryId=100007'},
                {name: '空调',   id: 'row3-2',   href:'./list.html?categoryId=100009'},
                {name: '冰箱',    id: 'row3-3',   href:'./list.html?categoryId=100006'},
                {name: '洗衣机',    id: 'row3-4',   href:'./list.html?categoryId=100008'}
            ]
        },
        {
            id      : 'row4',
            class   : 'keywords-item',
            tagA    : [
                {name: '厨卫家电',    id: 'row4-1',   href:'./list.html?keyword=厨卫家电'},
                {name: '小家电',   id: 'row4-2',   href:'./list.html?keyword=小家电'}
            ]
        },
        {
            id      : 'row5',
            class   : 'keywords-item',
            tagA    : [
                {name: '食品',    id: 'row5-1',   href:'./list.html?categoryId=100004'},
                {name: '酒类',   id: 'row5-2',   href:'./list.html?categoryId=100005'},
                {name: '生鲜',   id: 'row5-3',   href:'./list.html?categoryId=100021'}
            ]
        },
        {
            id      : 'row6',
            class   : 'keywords-item',
            tagA    : [
                {name: '个性化妆',    id: 'row6-1',   href:'./list.html?categoryId=100035'},
                {name: '清洁',   id: 'row6-2',   href:'./list.html?keyword=清洁'},
                {name: '纸品',   id: 'row6-3',   href:'./list.html?keyword=纸品'}
            ]
        },
        {
            id      : 'row7',
            class   : 'keywords-item',
            tagA    : [
                {name: '母婴',    id: 'row7-1',   href:'./list.html?categoryId=100038'},
                {name: '玩具',   id: 'row7-2',   href:'./list.html?keyword=玩具'},
                {name: '童装童鞋',   id: 'row7-3',   href:'./list.html?categoryId=100014 '}
            ]
        },
        {
            id      : 'row8',
            class   : 'keywords-item',
            tagA    : [
                {name: '鞋靴',    id: 'row8-1',   href:'./list.html?keyword=鞋靴'},
                {name: '箱包',   id: 'row8-2',   href:'./list.html?keyword=箱包'},
                {name: '钟表',   id: 'row8-3',   href:'./list.html?keyword=钟表'},
                {name: '珠宝',   id: 'row8-4',   href:'./list.html?categoryId=100035'}
            ]
        },
        {
            id      : 'row9',
            class   : 'keywords-item',
            tagA    : [
                {name: '运动户外',    id: 'row9-1',   href:'./list.html?keyword=运动户外'},
                {name: '足球',   id: 'row9-2',   href:'./list.html?keyword=足球'},
                {name: '汽车生活',   id: 'row9-3',   href:'./list.html?keyword=汽车生活'},
            ]
        },
        {
            id      : 'row10',
            class   : 'keywords-item',
            tagA    : [
                {name: '图书',    id: 'row9-1',   href:''},
                {name: '音响',   id: 'row9-2',   href:'www.baidu.com'},
                {name: '电子书',   id: 'row9-3',   href:'www.baidu.com'},
            ]
        },

        // todo

        // todo
    ]
};
var contentTemplate = [
    require('./row1.string'),
    require('./row2.string'),
    require('./row3.string'),
    require('./row4.string'),
    require('./row5.string'),
    require('./row6.string'),
    require('./row7.string'),
    require('./row8.string'),
    require('./row9.string'),
    require('./row10.string')
];

// 常量池
var consts          = {
    index_keywordsList: '#keywords-list',
    index_keywordsSub: '.keywords-sub',
    index_keySubContent:'.keywords-sub-content',
    index_topSearch: '.top-search',
    index_bannerMainContent:'#banner-main-content',
    index_sliderRight:'.unslider-arrow.next'
};
// 功能池
var mfuncs          = {
    searchSubmit    : function () {

        // 取到输入框keyword, 别忘了去空格
        var keyword = $.trim($('#search-input-top').val());
        // 如果有值就提交, 并跳转到list页
        if (keyword) {
            window.location.href = './list.html?keyword=' + keyword;
        } else {
            // 如果为空, 就直接返回首页
            _mm.gohome();
        }
    },
    initSlider:function () {
        //初始化
        var $slider = $('.banner-slider').unslider({
            speed: 300,                 // 每个幻灯片的动画速度（以毫秒为单位）
            delay: 3000,                // 幻灯片动画之间的延迟（以毫秒为单位）
            // complete: function() {},   // 每个幻灯片动画后调用的函数
            keys: true,                // 启用键盘（左，右）箭头快捷键
            dots: true,               // 显示点导航
            fluid: true              // 支持响应式设计。可能打破无响应的设计
        });
        $('.unslider-arrow').click(function() {
            var forword = $(this).hasClass('prev') ? 'prev' : 'next';

            //  Either do unslider.data('unslider').next() or .prev() depending on the className
            $slider.data('unslider')[forword]();
        });
    }
};
// 验证功能池子
var mfuncsVerify    = {};
// 主逻辑
var index           = {
    init            :function () {
        this.rendTemplate();
        this.bindEvent();
        mfuncs.initSlider();
    },
    bindEvent       :function () {
        $('#btn-search-top').click(function () {
            mfuncs.searchSubmit();
        });
        $('#search-input-top').keyup(function (e) {
            if (e.keyCode === 13) {
                mfuncs.searchSubmit();
            }
        });
        var keywordsSub = $(consts.index_keywordsSub);
        var subContent = $(consts.index_keySubContent);

        $(consts.index_keywordsList).mouseenter(function (e) {
            keywordsSub.show();
        }).mouseleave(function () {
            keywordsSub.hide();
            $(consts.index_keywordsSub).mouseenter(function () {
                keywordsSub.show();
            }).mouseleave(function () {
                keywordsSub.hide();
            });
        });
        // 批量绑定事件
        for (var i=1;i<11;i++) {
            !function (i) {
                $("#row" + i).mouseenter(function () {
                    subContent.html(contentTemplate[i-1]);
                });
            }(i);
        }


    },
    rendTemplate    :function () {

        var htmlResult = _mm.renderHtml(template, tempData);
        $(consts.index_keywordsList).html(htmlResult);
    }
};

window.onscroll     = function () {
    var keywordsSub = $(consts.index_keywordsSub);
    var scroll      = $(document);
    var currentScroll = scroll.scrollTop();
    var topSearch   = $(consts.index_topSearch);
    if (currentScroll > 500 ) {
        keywordsSub.hide();
        topSearch.css(
            "top", "0"
        );
    }else if (currentScroll > 140) {
        keywordsSub.css(
            "top",scroll.scrollTop()+"px"
        );
        topSearch.css(
            "top", -50 + "px"
        );
    } else  {
        keywordsSub.css(
            "top", "140px"
        );
    }
};
// 图片懒加载
function throttle(fn, delay, atleast) {
    var timeout = null,
        startTime = new Date();
    return function() {
        var curTime = new Date();
        clearTimeout(timeout);
        if(curTime - startTime >= atleast) {
            fn();
            startTime = curTime;
        }else {
            timeout = setTimeout(fn, delay);
        }
    }
}
function lazyload() {
    var images = document.getElementsByTagName('img');
    var len    = images.length;
    var n      = 0;      //存储图片加载到的位置，避免每次都从第一张图片开始遍历
    var floorLine = document.getElementsByClassName('floor-line');
    var m      = 0;
    var fLen    = floorLine.length;
    return function() {
        var seeHeight = document.documentElement.clientHeight;
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        for(var i = n; i < len+3; i++) {
            if(images[i] && $(images[i]).offset().top < seeHeight + scrollTop+150) {
                var att = images[i].getAttribute('data-src');
                if(att) {
                    $(images[i]).hide().attr("src",att).fadeIn(400);
                    n = n + 1;
                }
            }
        }
    }
}
var loadImages = lazyload();
//初始化首页的页面图片
loadImages();
window.addEventListener('scroll', throttle(loadImages, 500, 1000), false);
// 图片懒加载
index.init();