var conf = {
    serverHost:'https://www.qiongmaomall.top'
};
var hogan = require('hogan.js');
var _mm = {
    request: function (param) {
        var _this = this;
        $.ajax({
            // 是get方法还是post方法    默认值↓
            type    : param.method  || 'get',
            // 请求的url
            url     : param.url     || '',
            // 指定返回的数据类型
            dataType: param.type    || 'json',
            // 请求的数据
            data    : param.data    || '',
            // 是否异步, 同步为false
            async: param.async !== false,
            // 成功后的回调方法
            success: function (res,responseWords,XHR) {
                if (0 === res.status) {
                    // 如果是0的话代表成功, 如果传递过来的param的success是function类型就把响应的数据和信息反注入到param引用源的success方法参数中
                    typeof param.success === 'function' && param.success(res.data, res.msg);
                }
                else if (10 === res.status) {
                    // 没有登录状态, 需要强制登录
                    _this.doLogin();
                }
                else if (1 === res.status) {
                    // 请求数据错误, 调用error的回调
                    typeof param.error === 'function' && param.error(res.msg);
                }

            },
            // 失败的回调方法
            error: function (err) {
                // 如遇到404等error
                // typeof param.error === 'function' && param.error(err.statusText);
                typeof param.error === 'function' && param.error(err);

            }
        });
    },
    // 获取服务器地址
    getServerUrl: function (path) {
        return conf.serverHost + path;
    },
    // 获取url参数
    getUrlParam: function (name) {
        // 例如检索出 happymmall.com/product/list?keyword=xxx&page=1 每个参数值
        var reg      = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        // window.location.search 就是 ?keyword=xxx&page=1这段参数
        var result   = window.location.search.substr(1).match(reg);
        // 如果有值进行解码
        return result ? decodeURIComponent(result[2])  : null;
    },
    // 渲染, 把传入的模板和数据进行拼接
    renderHtml:function(htmlTemplate, data){
        // hogan编译
        var template     = hogan.compile(htmlTemplate);
        //
        var result        = template.render(data);
        return result;
    },
    // 提示功能
    successTip:function(msg){
        alert(msg || '操作成功!')
    },
    errorTip:function(msg){
        alert(msg || '操作失败!')
    },
    // 字段验证, 支持非空判断, 手机.邮箱
    validate:function(valueInput, type){
        var value = $.trim(valueInput);
        // 非空验证
        if ('require' === type) {
            // 强转成布尔型, 有值的话连续转两次
            return !!value;
        }
        // 手机验证
        if ('phone' === type) {
            return /^1\d{10}$/.test(value);
        }
        // 邮箱验证
        if ('email' === type) {
            var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
            return reg.test(value);
        }
        // 密码提示问题
        if ('passwordQuestion'  === type) {
            return value.length < 21 || !value;
        }
        // 密码提示答案
        if ('passwordAnswer' === type) {
            return value.length < 21 || !value;
        }
    },
    // 封装doLogin方法
    doLogin : function () {

        // 跳转后记住是从哪里跳转的, 但是有特殊字符会截断, 所以进行完全编码
        window.location.href = './user-login.html?redirect=' + encodeURIComponent(window.location.href);  // 加上当前页面的地址
    },
    gohome: function () {
        window.location.href = './index.html'

    }
};
module.exports = _mm;