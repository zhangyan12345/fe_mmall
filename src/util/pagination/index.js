
require('./index.css');
var templatePagination = require('./index.string');
var _mm         = require('util/mm.js');
// 外部调用模型,只调用render,需要回调的话就加入onselect方法
// 解决思路: 给 .pg-content .pg-item 绑定事件, 获取data-value的值为当前页 然后和每页最大页码一起发送给后端,然后请求接口,得到数据模型
//
// loadPagination:function (res) {
//     var _paganition = new Pagination();
//     // 请求接口, 渲染数据
//     var pageInfo = {
//         container: $(consts.pagination),
//         hasPreviousPage: res.hasPreviousPage,
//         hasNextPage: res.hasNextPage,
//         prePage: res.prePage,
//         pageNum: res.pageNum,
//         nextPage: res.nextPage,
//         lastPage: res.lastPage,
//         isFirstPage: res.isFirstPage,
//         isLastPage: res.isLastPage,
//         pageSize: res.pageSize,
//         pages: res.pages,
//         onSelectPage:null
//     };

//     var html = '';
//     // 渲染设置
//     _paganition.render(pageInfo);
//     // 得到html
//     html = _paganition.getPaginationHtml();
//     // 替换pagination内容
//     $(consts.pagination).html(html);
// }

var Pagination = function () {
    var _this = this;
    // 成员变量全用this.+
    this.defaultOption = {
        container: null,
        pageNum: 1,
        pageRenge: 3,
        onSelectPage: null
    };
    this.option = {};
    // 事件代理( 因为组件new的时候会先加载成员变量 ) , on为绑定事件方法
    $(document).on('click','.pg-item',function () {
        var $this = $(this);
        // disabled和active属性的不做处理
        if ($this.hasClass('disabled') || $this.hasClass('active')) {
            return;
        }
        // 判断是不是方法类型, 如果是方法就调用list给的回调函数, 将值反赋值给list的listParam, 传入当前点击对象的date-value值
        typeof _this.option.onSelectPage === 'function' ? _this.option.onSelectPage($this.data('value')) : null;
    });
    // 方法添加方式
    // 渲染分页组件
    Pagination.prototype.render = function (userOption) {
        // 合并设置, 注意写法, 前面要加个空对象, 这样才能完美合并
        this.option = $.extend({}, this.defaultOption, userOption);
        // 内容校验-----------------------------------------------------

        // 判断容器是否为合法的jQ对象
        if (!(this.option.container instanceof jQuery)) {
            return;
        }
        // 只有一页的话就不显示分页
        if (this.option.pages <= 1) {
            return;
        }
        // 渲染分页内容-----------------------------------------------------
        this.option.container.html(this.getPaginationHtml());
    };
    // 获取分页的html
    Pagination.prototype.getPaginationHtml = function () {
        // |上一页| 1 2 3 4 5 6 |下一页|  5/6
        // 制作页面容器
        var html = '';
        var option = this.option;
        // 部件容器
        var pageArray = [];

        // 显示范围
        // 显示范围, 起点终点, 弹性区间
        var start = option.pageNum - option.pageRenge > 0 ? option.pageNum - option.pageRenge : 1;
        var end = option.pageNum + option.pageRenge < option.pages? option.pageNum + option.pageRenge : option.pages;
        // 上一页的内容

        pageArray.push({
            name:'上一页',
            value:this.option.prePage,
            disabled:!this.option.hasPreviousPage,
            isButton:true
        });
        // 前面的省略
        if (option.pageNum-4>1) {
            pageArray.push({
                name:1,
                value:1,
                active:(1===option.pageNum),
            });
            pageArray.push({
                name:'...',
                isBla:true
            });
        }
        // 数字按钮的处理
        for (var i = start;i<=end;i++) {
            pageArray.push({
                name:i,
                value:i,
                active:(i===option.pageNum),
            })
        }
        // 后边的省略
        if (option.pageNum+4<option.pages) {
            pageArray.push({
                name:'...',
                isBla:true
            });
            pageArray.push({
                name:option.pages,
                value:option.pages,
                active:(option.pages===option.pageNum),
            });

        }

        // 下一页按钮的数据
        pageArray.push({
            name:'下一页',
            value:this.option.nextPage,
            disabled:!this.option.hasNextPage,
            isButton:true
        });
        // 渲染分页组件
        html = _mm.renderHtml(templatePagination, {
            pageArray: pageArray,
            pageNum: option.pageNum,
            pages: option.pages
        });
        return html;
    }
};

module.exports = Pagination;