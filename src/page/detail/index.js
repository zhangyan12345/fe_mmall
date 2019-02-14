require('./index.css');
var _header         = require('page/common/header/index.js');
var _loginWindow    = require('util/login-window/index.js');
var _nav            = require('page/common/nav/index.js');
var _mm             = require('util/mm.js');
var _alert          = require('util/alert-window/index.js');
var _product        = require('service/product-service.js');
var _cart           = require('service/cart-service.js');
var _magnfier       = require('util/magnifier.js');
var _tools          = require('util/tools.js');
var detailFrame     = require('./detail-frame.string');
var typeDefult      = require('./type-default.string');
var typeTemplate    = require('./type.string');
var _userService    = require('service/user-service.js');

// 常量池
var consts            = {
    detail_detailContent        :'.detail-con',
    detail_imgMain              : '.img-main',
    detail_imgThumbItem         :'.img-thumb-item',
    detail_title                :'.property-item.title',
    detail_subTitle             :'.property-item.subtitle',
    detail_price                :'#price-con',
    detail_priceOrg             :'#price-org',
    detail_integralTop          :'.integral-A',
    detail_commentTotal         :'.comments-total',
    detail_inventoryNum         :'#inventory-num',
    detail_typeList             :'.type-list',
    detail_detailFrame          :'.page-main .w',
    detail_addToCart            :'#add-to-cart',
    detail_typeFrame            :'.property-item.type',
    detail_fixedTab             :'.fixed-tab',
    detail_submitBy             :'#submit-buy'
};
// 缓存池
var cache             = {
    productId           : _mm.getUrlParam("productId"),
    colorSelect         :'',
    sizeSelect          :'',
    buyNum              :1,
    proBean             :{},
    loginState          :false

};
// 功能池
var mfuncs            = {
    typeVertify:function () {
        // 商品型号检查
        var typeFrame = $(consts.detail_typeFrame);
        if (!cache.colorSelect || !cache.sizeSelect) {
            typeFrame.addClass('error');
            return false;
        }
        typeFrame.removeClass('error');
        return true;
    },
    checkLogin:function (funcSuc) {
        var _this = this;
        _userService.checkLogin(function (res) {
            cache.loginState = true;
            if (funcSuc) {
                funcSuc();
            }



        }, function (err) {
            cache.loginState = false;
           // 如果没有登录,弹出登录框-(回调, 改变登录状态方法, 传入刷新方法)
            _this.showLogin();
           //todo
        });
    },
    // 让nav同步刷新
    showLogin:function () {
        // 传入回调方法
        _loginWindow.show({
            changeState:function () {
                cache.loginState = true;
                console.log(cache.loginState);
            },
            // 显示成功框
            showSuccess:function () {
                _alert.show("登录成功");
            },
            // 刷新nav栏的用户登录信息
            flushNav:function () {
                // 刷新用户信息
                _nav.loadUserInfo();
                // 刷新购物车数量
                _nav.loadCartCount();
            },


        });
    }
};
// 主逻辑
var detail            = {
    init            :function () {
        // 显示header子标题
        _header.showSubtitle("商品详情");
        // 加载商品信息
        if (this.onLoad()) {
            return;
        }
        this.bindEvent();
        this.interfaceTet();
    },
    onLoad          :function(){
        var _this = this;
        // 如果没传Id
        if (!cache.productId) {
            _alert.show("没有指定相关产品ID");
            return true;
        }
        _product.getProductDetail(cache.productId,function (res) {
            // 无商品信息时候
            if (!res.detail) {
                res.detail = ['        <div class="testCont">\n' +
                '                    <div class="title">无商品详情...</div>\n' +
                '                </div>'];
            }
            // 过滤器, 过滤subimage
            _this.filter(res);
            cache.proBean = res;
            // 加载信息
            _this.loadDetails(res);
            // 加载类别信息
            _this.loadTypeList();
            mfuncs.checkLogin();
        },function (err) {
            // 获取产品信息失败
            _alert.show(err.status || err,null,function () {
                window.location.href = './index.html';
            });
        });
        // 加载产品详情

    },
    bindEvent       : function () {
        var _this = this;
            // 类型选择时间,动态绑定类
        $(document).on('click','.type-item',function () {
            var $this = $(this);
            // disabled和active属性的不做处理
            if ($this.hasClass('disabled') || $this.hasClass('active')) {
                return;
            }
            if ($this.hasClass('size')) {
                // 给当前点击对象添加active状态
                $this.addClass('active').siblings('.type-item.size').removeClass('active');
                // 将值存储到缓存池
               cache.sizeSelect =  $this.text();
            }
            if ($this.hasClass('color')) {
                $this.addClass('active').siblings().removeClass('active');
                cache.colorSelect =  $this.text();
            }
        });
        // 购买数量事件
        $(document).on('click','.arr-item',function () {
            var $this           = $(this);
            var numInput        = $('#num-count');
            var currentCount    = parseInt(numInput.val());
            var maxCount        = cache.proBean.stock || 1;
            var minCount        = 1;

            var type = $this.hasClass('num-down') ? "down" : "up";
            // todo
            // console.log("maxCount:"+maxCount +" | minCount:" + minCount + " | type:"+type);

            switch (type) {
                case "up":
                    numInput.val( currentCount < maxCount? currentCount+1:maxCount );
                    break;
                case "down":
                    numInput.val(currentCount > minCount ? currentCount-1 : minCount);
                    break;
            }
            // 将购买数量添加到缓存
            cache.buyNum = numInput.val();


        });
        // tab选项卡事件
        $(document).on('click','.tab-title-item',function () {
            var $this = $(this);
            if ($this.hasClass('active')) {
                return;
            }
            // 给当前元素添加active状态并取消兄弟元素的active
            $this.addClass('active').siblings().removeClass('active');
            // 提取当前元素的data-content属性值
            var conId = $this.data('content');
            $('#' + conId).show().siblings().hide();
        });
        // 跳转到累计评价
        $(document).on('click','#comments-total-goto-bottom',function () {
            $('#comments-total-bottom').click();
        });
        // gallery缩略图事件
        $(document).on('mouseenter',consts.detail_imgThumbItem,function () {
            var src = $(this).attr("src");
            _magnfier(".img-main", 430, 430, src, 200, 200, 430);

        });
        // 鼠标进入主图
        $(document).on('mouseenter',consts.detail_imgMain,function () {

            clearInterval(t);
            // 开启计时器, 屏幕上滚
            var t = setInterval(function () {
                var screenTop = document.documentElement.scrollTop ;
                if (screenTop<=0) {
                    clearInterval(t);
                }
                var gotoSc = screenTop - 10;
                window.scrollTo(gotoSc,gotoSc)
            },1);
        });
        // 加入购物车
        $(document).on('click',consts.detail_addToCart,function () {
            mfuncs.checkLogin();
            // 校验型号选择
            if (!mfuncs.typeVertify()) {
                return;
            }
            // 数据打包准备添加购物车
            var dataPack = {
                productId       : cache.productId,
                count           : cache.buyNum,
                size            :cache.sizeSelect,
                color           :cache.colorSelect
            };
            // 检查登录状态
            _userService.checkLogin(function (res) {
                // 如果登录了 -> 添加购物车
                _cart.addTocart(dataPack,function (res) {
                    _alert.show("添加购物车成功");
                    // 刷新购物车数量
                    _nav.loadCartCount();
                },function (err) {
                    _alert.show(res.status || res);
                });
            },function (err) {
                // 如果没登录
                mfuncs.showLogin();
            });


        });
        // 绑定fixed tab事件
        $('.fixed-tab-item').click(function () {
            var tabProductDetail        = $('#tab-product-detail');
            var tabComments             = $('#comments-total-bottom');
            var tabService              = $('#tab-service');
            var $this                   = $(this);

            if ($this.hasClass('detail')) {
                tabProductDetail.click();
                return;
            }
            if ($this.hasClass('comment')) {
                tabComments.click();
                return;
            }
            if ($this.hasClass('service')) {
                tabService.click();
                return;
            }

        });
        // 立即购买按钮
        $(document).on('click', consts.detail_submitBy, function () {
            mfuncs.checkLogin(function () {
                // 1. 添加进购物车
                var dataPack = {
                    productId       : cache.productId,
                    count           : cache.buyNum,
                    size            :cache.sizeSelect,
                    color           :cache.colorSelect
                };
                // 1. 移除购物车当前商品
                _cart.deleteProduct(dataPack.productId,function (res) {
                    // 2. 购物车取消全选
                    _cart.unSelectAll(function (res) {
                        // 3. 添加当前商品到购物车
                        _cart.addTocart(dataPack,function (res) {
                            // 4. 前往订单页
                            window.location.href="./order-confirm.html"
                        },function (err) {
                            _alert.show(err.status || err);
                        });
                    },function (err) {
                        _alert.show(err.status || err);
                    });
                },function (err) {
                    _alert.show(err.status || err);
                });
            });

        });
    },
    loadDetails     : function (proBean) {
        // 渲染html整体
        var htmlResult = '';
        var detailCon = $(consts.detail_detailFrame);
        htmlResult = _mm.renderHtml(detailFrame,proBean);
        detailCon.hide();
        detailCon.html(htmlResult).fadeIn(500);
        // 渲染放大镜
        _magnfier(".img-main", 430, 430, cache.proBean.imageHost+cache.proBean.mainImage, 200, 200, 430);
        var priceOrg = $(consts.detail_priceOrg);
        var integralTop = $(consts.detail_integralTop);
        var commentTotal = $(consts.detail_commentTotal);

        priceOrg.text((Number(cache.proBean.price) * 1.3).toFixed(2));
        integralTop.text(Math.round((cache.proBean.price-0)*0.2));
        commentTotal.text(Math.round(_tools.randomGeneric(2000,5000)));

    },
    // 渲染规格选项
    loadTypeList    :function () {

        var list = $(consts.detail_typeList);
        if (!cache.proBean.size && !cache.proBean.color) {
            list.html(typeDefult);
            cache.sizeSelect = "默认";
            cache.colorSelect = "默认";
            return;
        }
        // 渲染
        var html = _mm.renderHtml(typeTemplate,cache.proBean);
        list.html(html);
    },
    // 接口测试( 无实际用途 )
    interfaceTet    :function () {
        $(document).on('click','#testBtn',function () {
            _product.getProductDetail(cache.productId,function (res) {
                console.log(res);
            },function (err) {
                console.log(err);
            });
        });

    },
    filter          :function (data) {
        data.subImages = data.subImages.split(",");
        // 将逗号分隔的字符串转为数组
    },
};
// 屏幕滚动
window.onscroll       = function () {

    var scroll      = $(document);
    var currentScroll      = scroll.scrollTop();
    var fixedTab = $(consts.detail_fixedTab);
    if (currentScroll > 680) {
        fixedTab.css(
            "top", "0"
        );
    } else {
        fixedTab.css(
            "top","-35px"
        );
    }
};


detail.init();