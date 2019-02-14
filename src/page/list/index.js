require('./index.css');
require('page/common/nav/index.js');
require('./index.css');
var _header         = require('page/common/header/index.js');
var _user           = require('service/user-service.js');
var _mm             = require('util/mm.js');
var _alert          = require('util/alert-window/index.js');
var _product        = require('service/product-service.js');
var listTemplate    = require('./listTemplate.string');
var Pagination      = require('util/pagination/index.js');
var emptyHint       = '<div class="empty-hint">\n' +
    '            <div class="empty-content">对不起, 没有此类商品 T^T</div>\n' +
    '            <a href="./index.html" class="empty-return btn-ab">返回首页</a>\n' +
    '            </div>';
// 常量池
var consts          = {
    list_crumbKey:'#crumb-key',
    listCon:'.list-con',
    list_topSearch: '.top-search',
    list_sortItem:  '.sort-item',
    list_sortPrice: '#sort-price',
    list_pagination:'.pagination'
};
// 缓存池
var cache           = {
    listParam:{
        keyword: _mm.getUrlParam("keyword")       || '',
        categoryId: _mm.getUrlParam("categoryId") || '',
        orderBy: _mm.getUrlParam("orderBy")       || "default",
        // 初始页
        pageNum: _mm.getUrlParam("pageNum")       || 1,
        // 每页追踪的容器数量
        pageSize: _mm.getUrlParam("pageSize")     || 10
    }
};
// 功能池
var mfuncs          = {
    fillCrumb: function () {
        var keywords = cache.listParam.keyword;
        $(consts.list_crumbKey).text(keywords);
    },
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
};
// 主逻辑
var list            = {
    init            :function () {
        // 填充面包屑导航
        mfuncs.fillCrumb();
        // 显示子导航文字
        _header.showSubtitle("商品列表");
        this.bindEvent();
        this.loadList();
    },
    bindEvent       : function () {
        var _this = this;
        $('#btn-search-top').click(function () {
            mfuncs.searchSubmit();
        });
        $('#search-input-top').keyup(function (e) {
            if (e.keyCode === 13) {
                mfuncs.searchSubmit();
            }
        });
        // 排序功能
        $(consts.list_sortItem).click(function () {
            var sortPrice = $(consts.list_sortPrice);
            // 重置当前页码
            cache.listParam.pageNum = 1;
            // jq 中选择当前元素需要 $(this)
            var $this = $(this);
            // 点击默认排序
            if ($this.data('type') === 'default') {
                // 拿到自定义属性值
                if ($this.hasClass('active')) {
                    // 如果default按钮是激活状态的话, 就不产生事件
                    return;
                } else {
                    sortPrice.text('价格排序');
                    cache.listParam.orderBy = 'default';
                    // 如果是非激活状态的话, 给default按钮元素添加
                    $this.addClass('active').siblings('.sort-item').removeClass('active asc desc');
                }
            }
            //点击价格排序
            if ($this.data('type') === 'price') {
                // 清空样式
                $this.addClass('active').siblings('.sort-item').removeClass('active asc desc');
                // 如果是默认或者降序中就点击变成升序
                if (!$this.hasClass('asc')) {
                    sortPrice.text('价格 (低 -> 高)');
                    $this.addClass('asc').removeClass('desc');
                    cache.listParam.orderBy = 'price_asc';
                } else {
                    // 升序过程中点击变成降序
                    sortPrice.text('价格 (高 -> 低)');
                    $this.addClass('desc').removeClass('asc');
                    cache.listParam.orderBy = 'price_desc';
                }
            }
            // 刷新页面
            _this.loadList();

        });

    },
    // 加载list
    loadList        : function () {
        var _this = this;
        // 结果集缓存容器
        var listHtml = '';
        // 参数变量
        var listParam = cache.listParam;
        // list容器变量
        var listCon = $(consts.listCon);
        // 超过200毫秒后开启进度条预加载,// todo
        clearTimeout(cache.t);
        cache.t = setTimeout(function () {
            listCon.html('<div class="loading"></div>');
        }, 300);
        // 变量过滤( 如果用的是keyword就扇窗户categoryId否则删除keyword )
        listParam.categoryId ? (delete listParam.keyword) : (delete listParam.categoryId);
        // ListParam中有关键字. 分页信息等
        _product.getProductList(listParam, function (res) {
            clearTimeout(cache.t);
            listCon.hide();
            if (res.list.length === 0) {
                // 空页面提示
                listCon.html(emptyHint).fadeIn(300);
                return;
            }
            // 根据结果集渲染模板
            listHtml = _mm.renderHtml(listTemplate,res);
            //  定义页面内容
            listCon.html(listHtml).fadeIn(200);
             // 分页初始化分页信息
            var pageInfo = {
                container:$(consts.list_pagination),
                hasPreviousPage:res.hasPreviousPage,
                hasNextPage:res.hasNextPage,
                prePage:res.prePage,
                pageNum:res.pageNum,
                nextPage:res.nextPage,
                lastPage:res.lastPage,
                isFirstPage:res.isFirstPage,
                isLastPage:res.isLastPage,
                pageSize:res.pageSize,
                pages:res.pages,
            };
            // 渲染分页
            _this.loadPagination(pageInfo);
        },function (err) {
            if (err.status === 404) {
                _alert.show("连接服务器失败");
                return;
            }
            _alert.show(err.status || err,null,function () {
                window.location.href = './index.html';
            });
        });
    },
    // 加载分页信息
    loadPagination: function (pageOption) {
        var _this = this;
        // 制作分页组件, 添加一个新的属性pagination并new一个对象
        this.pagination ? '': (this.pagination = new Pagination());
        // 渲染分页组件
        this.pagination.render($.extend({},pageOption,{
            // 传入回调方法, 让组件内部也可以操作本页面的方法
            onSelectPage:function (pageNum) {
                // 改变当前panation属性对象的pageNum
                cache.listParam.pageNum = pageNum;
                _this.loadList();
            }
        }));
    }
};
// 浮动搜索
window.onscroll     = function () {
    var scroll      = $(document);
    var topSearch   = $(consts.list_topSearch);
    if (scroll.scrollTop() > 300) {
        topSearch.css(
            "top", "0"
        );
    }else  {
        topSearch.css(
            "top", -50 + "px"
        );
    }

};

list.init();