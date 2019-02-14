/*
 * @Author: Avenda
 * @Date: 2018/10/6
 */

require('./index.css');
require('page/common/nav/index.js');

var _mm                 = require('util/mm.js');
var _user               = require('service/user-service.js');
var _alert              = require('util/alert-window/index.js');
var _addrWin            = require('util/addr-window/index.js');
var addrTemplate        = require('./addrItem-frame.string');
var productTemplate     = require('./productItem.string');
var newAddrTempalte     = require('./newAddrTemplate.string');
var _confirmWin         = require('util/confirm-window/index.js');

var _orderService = require('service/order-service');

// 常量池
var consts              = {
    showAllAddr:'.show-all-addr',
    addrCon:'#addr-content',
    addrConWrap:'.address-con-wrap',
    addrItem: '.addr-item',
    addNewAddr:'.add-new-addr',
    modifyAddr:'.oper-item.modify',
    deleteAddr:'.oper-item.delete',
    productCon:'#product-content',
    finalTotalPrice:'#final-total-price',
    submitBtn:"#create-order"
};
// 缓存池
var cache               = {
    userId:'',
    addrInfo:{},
    selectAddr:{}
};
// 功能池
var mfuncs              = {
    checkLogin          :function(){
        _user.checkLogin(function (res) {
            // 缓存id
            cache.userId = res.id;
        },function (err) {
            setTimeout(function () {
                _mm.doLogin();
            },1000);
        });
    },
    // 加载地址列表
    loadAddrList        :function () {
        var html = '';
        // 请求接口
        _orderService.getAddrList(function (res) {
            // 缓存数据
            cache.addrInfo = res;
            // 渲染模板
            html = _mm.renderHtml(addrTemplate, res);
            // 替换html
            $(consts.addrCon).hide().html(html).fadeIn(300);
        },function (err) {
            _alert.show(err.status || err);
        });
    },
    // 删除地址
    deleteCurrentAddr   :function (currentItem) {
        var $thisItem = currentItem.parents('.addr-item');
        var shippingId = $thisItem.data("shippingid");
        var isSelect = $thisItem.hasClass('select');
        // 拿到当前节点id
        // 确认是否删除?
        _confirmWin.show("是否删除此地址?",function () {
            // 调用接口, 成功后本地删除节点
            _orderService.deleteAddrItem(shippingId,function (res) {
                // 删除节点
                $thisItem.remove();
                if (isSelect) {
                    // 清空底部元素
                    mfuncs.fillBottomList();
                }
            },function (err) {
                _alert.show(err.status || err);
            });
        });
    },
    // 加载订单商品
    loadProductList:function () {
        var html = '';
        // 请求接口得到数据, 渲染数据
        _orderService.getOrderCart(function (res) {
            // 渲染商品list
            html = _mm.renderHtml(productTemplate, res);
            $(consts.productCon).hide().html(html).fadeIn(300);
            // 总价格填充
            $(consts.finalTotalPrice).text(res.productTotalPrice);
        },function (err) {
            if (err==="购物车为空") {
                // todo
                setTimeout(function () {
                    window.location.href = "./cart.html";
                },1000);
            }
            _alert.show(err.status || err);
        });

    },
    // 创建订单
    createOrder:function () {
        var id = cache.selectAddr.id;
        if (!id) {
            _alert.show("请选择收件人地址");
            return;
        }
        // 调用接口提交订单
        _orderService.createOrder(id,function (res) {
            window.location.href = "./payment.html?orderNo="+res.orderNo;
        },function (err) {
            _alert.show(err.status || err);
        });

    },
    // 填充底部最终清单
    fillBottomList:function (res) {
        if (res) {
            // 填充底部元素
            $('.sb-final-province').text(res.receiverProvince || res.province);
            $('.sb-final-city').text(res.receiverCity || res.city);
            $('.sb-final-detail').text(res.receiverAddress || (res.area + res.addrDetail));
            $('.sb-final-name').text(res.receiverName || res.name);
        } else {
            // 清空底部元素
            $('.sb-final-province').text("");
            $('.sb-final-city').text("");
            $('.sb-final-detail').text("");
            $('.sb-final-name').text("");
        }
    }
};
// 主逻辑
var orderConfirm        = {
    init            : function () {
        this.preLoad();
        this.doCheck();
        this.onLoad();
        this.bindEvent();
        this.runtime();
    },
    preLoad         : function () {

    },
    doCheck         : function () {
        mfuncs.checkLogin();
    },
    onLoad          : function () {
        mfuncs.loadAddrList();
        mfuncs.loadProductList();
    },
    bindEvent       : function () {
        // 显示所有地址绑定
        $(consts.showAllAddr).click(function () {
            var $this = $(this);
            // 拉开全部地址
            $(consts.addrConWrap).css("height","initial");
            $this.remove();
        });
        // 选中地址
        $(document).on('click',consts.addrItem,function (e) {

            var $this = $(this);
            var id = $this.data('shippingid');
            if ($this.hasClass('select')) {
                return;
            }
            console.log(id);
            // 调用接口,填充底部数据
            _orderService.selectAddr(id,function (res) {
                // 缓存数据
                cache.selectAddr = res;
                // 添加select状态
                $this.addClass('select').siblings().removeClass('select');
                // 填充底部元素
                mfuncs.fillBottomList(res);
            },function (err) {

            });
        });
        // 添加新地址
        $(consts.addNewAddr).click(function () {
            _addrWin.show("添加新地址",null,{
                // 传入回调函数
                func1:function (formInfo) {
                     // 调用接口, 添加新地址
                    _orderService.addNewAddrItem({
                        // 接受来自addrWin的数据包,并发送给远程
                        receiverName        :formInfo.name,
                        receiverMobile      :formInfo.phone,
                        receiverProvince    :formInfo.province,
                        receiverCity        :formInfo.city,
                        receiverAddress     :formInfo.area + formInfo.addrDetail,
                        receiverZip         :formInfo.postcode

                    },function (res) {
                        // 得到插入的商品id
                        formInfo.id = res.shippingId;
                        // 渲染模板并插入节点
                        var html = '';
                        html = _mm.renderHtml(newAddrTempalte,formInfo);
                        // 定义插入点位置 第一个/或后面的
                        var insertNode = $(".addr-item:last");
                        if (insertNode.length === 0) {
                            $(consts.addrCon).append(html);
                        } else {
                            insertNode.after(html);
                        }

                    },function (err) {
                        _alert.show(err.status || err);
                    });
                 },
                alert:function (text) {
                    _alert.show(text);
                }
            });

        });
        // 修改地址
        $(document.body).on('click',consts.modifyAddr,function (event) {

            var $thisItem = $(this).parents('.addr-item');
            var isSelect = $thisItem.hasClass('select');
            // 提取当前元素的值
            var id          = $thisItem.data('shippingid');
            var name        = $thisItem.find('.name');
            var province    = $thisItem.find('.province');
            var city        = $thisItem.find('.city');
            var addrDetail  = $thisItem.find('.personal-detail');
            var phone       = $thisItem.find('.phone-number');
            var postcode    = $thisItem.find('.postcode');
            // 修改addrWin的值
            _addrWin.show("修改地址",{
                // 传入表单数据填充模态框
                name        :$.trim(name.text()),
                province    :$.trim(province.text()),
                city        :$.trim(city.text()),
                addrDetail  :$.trim(addrDetail.text()),
                phone       :$.trim(phone.text()),
                postcode    :$.trim(postcode.text()),
            },{
                // 传入回调函数, 修改当前的值
                func1:function (formInfo) {

                        // 过滤formInfo数据, 如果province. city 和 area是空的话就沿用原来的值
                    // 调用接口 修改端口值, 成功了的话同步节点值
                    _orderService.updateAddr({
                        id:id,
                        receiverName:formInfo.name,
                        receiverMobile:formInfo.phone,
                        receiverProvince:formInfo.province,
                        receiverCity:formInfo.city,
                        receiverAddress:formInfo.area + formInfo.addrDetail,
                        receiverZip:formInfo.postcode
                    },function (res) {
                        // 成功了的话同步节点值
                        name.text(formInfo.name);
                        province.text(formInfo.province);
                        city.text(formInfo.city);
                        addrDetail.text(formInfo.area + formInfo.addrDetail);
                        phone.text(formInfo.phone);
                        postcode.text(formInfo.postcode);
                        // 如果是选中元素的话就同步填充底部提交地址
                        if (isSelect) {
                            mfuncs.fillBottomList(formInfo);
                        }
                    },function (err) {
                        _alert.show(err.status || err);
                    });

                }

            });
            event.stopPropagation();
        });
        // 删除地址
        $(document.body).on('click',consts.deleteAddr,function (e) {
            e.stopPropagation();
            // 删除
            mfuncs.deleteCurrentAddr($(this));
        });
        // 创建订单
        $(consts.submitBtn).click(function () {
            mfuncs.createOrder();
        });
    },
    runtime         : function () {
    }
};


// 初始化左侧信息
orderConfirm.init();