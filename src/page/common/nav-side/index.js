require('./index.css');
var _mm             = require('util/mm.js');
var template        = require('./index.string');
// 侧边导航
var navSide         = {
    // 生成菜单
    option          : {
        // 菜单项
        name:"",
        navList: [
            // 初始化菜单需要数据, 字段名, 中文描述, 跳转链接
            {name: 'user-center', desc: '个人中心', href: './user-center.html'},
            {name: 'order-list', desc: '我的订单', href: './order-list.html'},
            {name: 'pass-update', desc: '修改密码', href: './user-pass-update.html'},
            {name: 'about', desc: '关于Qmall', href: './about.html'}
        ]
    },
    init            : function (selectName) {
        if (selectName) {
            this.option.name = selectName;
        }
        // $.extend(this.option, option);
        // 执行模板生成
        this.renderNav();
    },
    // 渲染导航菜单
    renderNav       : function () {
        // 遍历navlist, 计算active数
        for (var i=0,iLength = this.option.navList.length;i<iLength;i++) {
            if (this.option.navList[i].name === this.option.name) {
                this.option.navList[i].isActive = true;
            }
        }
        // 渲染html
        var navHtml = _mm.renderHtml(template,{
            navList: this.option.navList
        });
        // 把html放到容器里
        $('.nav-side').hide().html(navHtml).fadeIn(300);
    }
};
module.exports = navSide;
