require('./index.css');

var _header = require('page/common/header/index.js');
require('./index.css');
var _nav = require('page/common/nav/index.js');
var _user       = require('service/user-service.js');
var _mm         = require('util/mm.js');
var _alert = require('common/alert-window/index.js');
var _product = require('service/product-service.js');
var Pagination = require('util/pagination/index.js');
var _tools = require('util/tools.js');
var _cart = require('service/cart-service.js');
var _confimWIn = require('util/confirm-window/index.js');

// 常量池
var consts          = {
    // 购物车list容器
    cart_cartCon:'.cart-con',
    // 商品数量增减按钮
    cart_opCell:'.op-cell',
    // 提交购物车
    cart_cartSubmit:'#cart-submit-pay',
    // 购物车总价
    cart_cartPriceTotal:'#cart-price-total',
    // 选中商品总数量
    cart_cartCountTotal:'#cart-count-total',
    // 两个全选按钮
    cart_checkAllBtn  :'.check-all',
    // 所有商品的选择数量
    cart_allSearchInput: "input[name='product-count']",
    // 删除所有
    cart_deleteAll:'#cart-delete-all',
    // 删除选中
    cart_deleteSelect:'#cart-delete-select',
    // 删除此商品
    cart_deleteProduct:'.delete-product',
    cartVal_list: require('./index.string'),
    cartVal_empty: require('./empty.string')
};
// 缓存池
var cache           = {
    // 存取数据模型, 用来做提示
    cartList :{
        cartProductVoList:[],
        cartTotalPrice:'',
        allChecked:true
    },
    // 计时器
    timer:{}
};
// 主功能池
var mFuncs          = {
    // 加载购物车信息
    loadCartInfo            : function () {
        var _this = this;
        // 开启计时器, 300毫秒后显示loding图
        this.cell_startTimer();
        // 刷新购物车订单信息
        _cart.getCartList(function (res) {
            // 清除计数器
            _this.cell_clearTimer();
            // 刷新nav购物车数量
            _nav.loadCartCount();
            // 缓存数据
            cache.cartList = res;
            // 如果是返回的list为空就禁用全选按钮
            if ( cache.cartList.cartProductVoList.length<1) {
                cache.cartList.allChecked = false;
            }
            // 渲染html
            _this.cell_renderList();
            // 刷新框架数据
            _this.cell_flushFrame();
            // 初始化增减按钮
            _this.cell_initOpButton();
            // 判断是否全选
            _this.checkAll();
        },function (err) {

            _alert.show(err.status || err);
        });
    },
    // 全选, 用于渲染购物车时候加载
    checkAll                : function () {
        if (cache.cartList.allChecked) {
            $('.input-check').addClass('check');
            $('.product-item').addClass('select');
        } else {
            // 取消全选按钮的勾选
            $(consts.cart_checkAllBtn).removeClass('check');
            // 检查被选中的元素, 给元素添加select
            mFuncs.cell_initSelectCheck();
        }
        // 刷新总数量
        mFuncs.flushTotalCount();
    },
    // 前端刷新总数量
    flushTotalCount         :function () {
        var count = 0;
        $(consts.cart_allSearchInput).each(function (index, obj) {
            var ob = $(obj);
            if (ob.parent().parent().hasClass('select')) {
                count += ob.val()-0;
            }

        });
        $(consts.cart_cartCountTotal).text(count);
    },
    // 更新商品数量
    updateProductCount      :function (productId, count,priceItem) {
        // 调用接口
        _cart.updataProductCount({
            productId:productId,
            count:count
        },function (res) {

            // 遍历cartProductVoList数组,匹配productId相同的,拿到productTotalPrice更新
            var list = res.cartProductVoList;
            for (var i=0,iLength=list.length;i<iLength;i++) {
                if (list[i].productId===productId-0) {
                    // 更新本元素的单品总件
                    priceItem.text(list[i].productTotalPrice);

                }
            }
            // 刷新总价格
            mFuncs.cell_flushTotalPrice(res);


        },function (err) {
            _alert.show(err.status || err);
        });


    },
    // 加载时给check的元素productItem添加select
    cell_initSelectCheck    :function () {
        var checks = $('.product-check');
        checks.each(function (index, obj) {
            var o = $(obj);
            if (o.hasClass('check')) {
                o.parent().parent().addClass('select');
            }
        });
    },
    // 渲染html模板
    cell_renderList         : function()  {
        // 空购物车定义
        var html = consts.cartVal_empty;
        // filter: 如果有购物车信息更改html内容
        if (cache.cartList.cartProductVoList.length > 0) {
            // todo 渲染
            html = _mm.renderHtml(consts.cartVal_list, cache.cartList);
            // 开启结算按钮
            mFuncs.cell_switchSubmit(true);
        } else {
            mFuncs.cell_switchSubmit(false);
        }
        // 禁用结算按钮

        $(consts.cart_cartCon).hide().html(html).fadeIn(300);
    },
    // 离线刷新框架数据
    cell_flushFrame         : function () {
        // 刷新总数量
        mFuncs.flushTotalCount();
        // 刷新总价格
        $(consts.cart_cartPriceTotal).text(cache.cartList.cartTotalPrice);
        // 刷新全选状态
        // todo

    },
    // 开启计时器300毫秒后显示loading图
    cell_startTimer         : function () {
        clearTimeout(cache.timer);
        cache.timer = setTimeout(function () {
            $(consts.cart_cartCon).html('<div class="loading"></div>');
        },300);
    },
    // 清除loading图计时器
    cell_clearTimer         : function () {
        clearTimeout(cache.timer);
    },
    // 初始化每个订单商品的数量plus和minus
    cell_initOpButton       :function () {
        $('.op-cell').each(function (index,obj) {
            var $this = $(obj);
            var minValue = 1;
            var maxValue = $this.parent().parent().children('.info').children('.stock').children('.stock-value').text() - 0;
            var inputValue = $this.siblings('.search-input');
            var currentValue = inputValue.val()-0;
            // 减少按钮
            if ($this.hasClass('minus')) {
                if (currentValue <= minValue) {
                    $this.attr("disabled", "disabled");
                }
            } else  {
                if (currentValue >= maxValue){
                    $this.attr("disabled", "disabled");
                }

            }
        })
    },
    // 结算按钮的diabled与not之间的转换
    cell_switchSubmit       : function (state) {
        if (state) {
            $(consts.cart_cartSubmit).attr('disabled', false);
        } else {
            $(consts.cart_cartSubmit).attr('disabled', 'disabled');
        }

    },
    // 选中产品
    cell_productSelect      : function (productId) {
        // 调用接口传入id
        _cart.SelectProduct(productId,function (res) {
            // 刷新总价格
            mFuncs.cell_flushTotalPrice(res);
        },function (err) {
            _alert.show(err.status || err);
        });

    },
    // 取消选中产品
    cell_productUnSelect    :function (productId) {
        _cart.unSelectProduct(productId,function (res) {
            // 缓存数据
            cache.cartList = res;
            console.log(cache.cartList);
            // 刷新总价格
            mFuncs.cell_flushTotalPrice(res);
        },function (err) {
            _alert.show(err.status || err);
        });
    },
    // 刷新总价格
    cell_flushTotalPrice    :function (res) {
        cache.cartList = res;
        $(consts.cart_cartPriceTotal).text(res.cartTotalPrice);
    },
    // 全选
    cell_selectAll          :function () {
        _cart.selectAll(function (res) {
            // 刷新总价格
            mFuncs.cell_flushTotalPrice(res);
        },function (err) {
            _alert.show(err.status || err);
        });
    },
    // 全不选
    cell_unSelectAll        :function () {

        _cart.unSelectAll(function (res) {

            mFuncs.cell_flushTotalPrice(res);
        },function (err) {
            _alert.show(err.status || err);
        });
    },
    // 删除当前商品
    cell_deleteSingleProduct:function (currentItem) {
        var currentProduct = currentItem.parents('.product-item');
        var productId = currentProduct.data('productId');
        // 接口调用: 按productId删除
        _cart.deleteProduct(productId,function (res) {

            // 删除节点
            currentProduct.remove();
            // 刷新总价格
            mFuncs.cell_flushTotalPrice(res);
            // 刷新nav购物车数量
            _nav.loadCartCount();
            if (res.cartProductVoList.length===0) {
                mFuncs.loadCartInfo();
            }
        },function (err) {
            _alert.show(err.status || err);
        });
    },
    // 删除多个商品
    cell_deleteMultiProduct:function (all) {

        // All有值: 清空购物车, 没值: 删除指定商品
        var idArray = [];
        var idNode = [];
        var productCheck = '';
        // 清除购物车
        if (all) {
             productCheck = $('.product-check');
            productCheck.each(function (index, obj) {
                idArray.push($(obj).parent().parent().data('productId'));
            });
            _cart.deleteProduct(idArray.toString(),function (res) {
                // 缓存数据
                cache.cartList = res;
                _alert.show("购物车已清空");

                // 加载购物车信息
                mFuncs.loadCartInfo();
            },function (err) {
                _alert.show(err.status || err);
            });
            return;
        }
        productCheck = $('.product-check.check');
        // 删除选中
        // 遍历product-check,如果有check类就记录id, 然后调用接口删除数据, 再删除节点
        productCheck.each(function (index, o) {
            var obj = $(o);
                idArray.push(obj.parents('.product-item').data('productId'));
        });
        _cart.deleteProduct(idArray.toString(),function (res) {
            // 删除成功 -> 刷新list
            mFuncs.loadCartInfo();
            // 刷新总价格
            mFuncs.cell_flushTotalPrice(res);
        },function (err) {
            // 删除失败
            _alert.show(err.status || err);
        });

    },
    // 提交购物车
    submitCart:function () {
        if (cache.cartList && cache.cartList.cartTotalPrice > 0) {
            window.location.href = "./order-confirm.html";
        } else {
            _alert.show("请选择要结算的商品");
        }
    }
};
// 运行周期
var cart            = {
    init            : function () {
        this.preLoad();
        this.doCheck();
        this.onLoad();
        this.bindEvent();
        this.runtime();
    },
    preLoad         : function () {
        // 激活nav购物车按钮
        _nav.cartActive();
        // 显示head子标题
        _header.showSubtitle("购物车");
    },
    doCheck         : function () {
        _user.checkLogin(function () {

        },function () {
            // 没登录强制登录
            setTimeout(function () {
                _mm.doLogin();
            },1500);
        });

    },
    onLoad          : function () {
        // 加载购物车清单
        mFuncs.loadCartInfo();
    },
    bindEvent       : function () {
        // check按钮
        $(document).on('click','.input-check',function(){
            var checkAll = $('.input-check.check-all');
            var productCheck = $('.input-check.product-check');
            var $this = $(this);
            // 全选按钮--------------------------------------
            if ($this.hasClass('check-all')) {
                var allProductItem = $('.product-item');
                // 取消全选
                if ($this.hasClass('check')) {
                    // 调用接口
                    mFuncs.cell_unSelectAll();
                    // 全选按钮取消check
                    checkAll.removeClass('check');
                    // 所有产品元素复选框取消全选
                    productCheck.removeClass('check');
                    // 所有产品元素取消select状态
                    allProductItem.removeClass('select');
                    // 刷新总数量
                    mFuncs.flushTotalCount();
                } else {
                    // 全选
                    mFuncs.cell_selectAll();
                    checkAll.addClass('check');
                    productCheck.addClass('check');
                    allProductItem.addClass('select');
                    // 刷新总数量
                    mFuncs.flushTotalCount();
                }
            } else {
                // 产品单选-----------------------------------
                var productItem = $this.parent().parent();
                var productId = productItem.data('product-id');
                // 取消选中
                if ($this.hasClass('check')) {
                    // 产品取消select状态
                    productItem.removeClass('select');
                    // 本选框取消勾选
                    $this.removeClass('check');
                    // 调用取消选中接口
                    mFuncs.cell_productUnSelect(productId);
                } else {
                    // 产品添加select状态
                    productItem.addClass('select');
                    // 本选框勾选
                    $this.addClass('check');

                    // 请求接口获得回调
                    mFuncs.cell_productSelect(productId);

                }
                // 刷新总数量
                mFuncs.flushTotalCount();
                // 判断是否全选
                var mark = true;
                // 遍历判断是否有元素没有选中
                productCheck.each(function (index, a) {
                    if (!$(a).hasClass('check')) {
                        mark = false;
                        return;
                    }
                });
                if (mark) {
                    checkAll.addClass('check');
                    return;
                }
                checkAll.removeClass('check');
            }
        });
        // 数量加减 op-cell
        $(document).on('click',consts.cart_opCell,function () {
            var $this = $(this);
            var productId = $this.parent().parent().data('productId');
            // 最大值为库存
            var maxValue = $this.parent().parent().children('.info').children('.stock').children('.stock-value').text() - 0;
            var minValue = 1;
            var inputValue = $this.siblings('.search-input');
            var currentValue = inputValue.val()-0;
            // 减少按钮
            if ($this.hasClass('minus')) {
                inputValue.val(currentValue-1);
                $this.siblings('.plus').attr("disabled",false);
                if (currentValue<=minValue+1) {
                    $this.attr("disabled","disabled")
                }

            } else {
                // 增加按钮
                inputValue.val(currentValue+1);
                // 数量大于1解除减小按钮限制
                $this.siblings('.minus').attr("disabled",false);
                if (currentValue>=maxValue-1) {
                    $this.attr("disabled","disabled")
                }

            }
            console.log();
            // 调用接口, 更新商品选择数量
            mFuncs.updateProductCount(
                productId,
                inputValue.val(),
                $this.parent().siblings('.td.sum').children('.single-sum')
            );
            mFuncs.flushTotalCount();
        });
        // 删除商品绑定水煎
        $(document).on('click',consts.cart_deleteProduct,function () {
            var $this = $(this);
            // 删除商品
            _confimWIn.show("是否删除此商品?",function () {
                mFuncs.cell_deleteSingleProduct($this)
            });

        });
        // 清空购物车绑定事件
        $(consts.cart_deleteAll).click(function () {
            // 如果购物车本为空不鸟这波操作
            if (cache.cartList.cartProductVoList.length<1) {
                return;
            }
            _confimWIn.show("是否清除购物车?",function () {
                mFuncs.cell_deleteMultiProduct(111);
            });

        });
        // 删除选中事件绑定
        $(consts.cart_deleteSelect).click(function () {
            // 如果购物车本为空不鸟这波操作
            if (cache.cartList.cartProductVoList.length<1) {
                return;
            }
            _confimWIn.show("是否删除选中商品?",function () {
                mFuncs.cell_deleteMultiProduct();
            });

        });
        // 提交购物车
        $(consts.cart_cartSubmit).click(function () {
            mFuncs.submitCart();
        });
    },
    runtime         : function () {
    }
};

cart.init();

