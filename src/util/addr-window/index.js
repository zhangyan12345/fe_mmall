/*
 * @Author: Avenda
 * @Date: 2018/10/6
 */

require('./index.css');
require('node_modules/distpicker');
require('util/util-test/index');
var addrWin_consts          = {
    // 通用模块
    window      :$('.addr-window'),
    closeBtn    :$('#addrWin-close'),
    openBtn     :$('#addrWin-open-alert'),
    title       :$('#addrWin-title'),
    // 自定义模块
    name        :$('#receiver-name'),
    province    :$('#receiver-province'),
    city        :$('#receiver-city'),
    area        :$('#receiver-area'),
    addrDetail  :$('#receiver-addr-detail'),
    phone       :$('#receiver-phone'),
    postcode    :$('#receiver-postcode'),
    saveAddrBtn :$('.submit-save-address'),

};
var addrWin_cache           = {
    formInfo:{
        name        :'',
        province    :"",
        city        :"",
        area        :"",
        addrDetail  :'',
        phone       :'',
        postcode    :'',

    },
    callBackObj     :{
        func1:'',
        alert:''
    },
    orgProvince     :'',
    orgCity         :'',
    timer           :{}

};
var addrWin_funcs           = {
    // 获取表单值生成form表单值数据包
    loadCurrentValue:function () {
        addrWin_cache.formInfo.name = $.trim(addrWin_consts.name.val());
        addrWin_cache.formInfo.province =  $.trim($('#receiver-province option:selected').val());
        addrWin_cache.formInfo.city  = $.trim($('#receiver-city option:selected').val());
        addrWin_cache.formInfo.area  = $.trim($('#receiver-area option:selected').val());
        addrWin_cache.formInfo.addrDetail = $.trim(addrWin_consts.addrDetail.val());
        addrWin_cache.formInfo.phone = $.trim(addrWin_consts.phone.val());
        addrWin_cache.formInfo.postcode = $.trim(addrWin_consts.postcode.val());
    },
    formClear:function(){
        addrWin_cache.formInfo =  {
            name:'',
            province:"",
            city:"",
            area:"",
            addrDetail:'',
            phone:'',
            postcode:'',
        }
    },
    // 表格值初始化
    formInit:function (formInfo) {

        if (!formInfo) {
            formInfo = addrWin_cache.formInfo;
        }
        // 缓存原始省份和成寿寺数据
        addrWin_cache.orgProvince = formInfo.province;
        addrWin_cache.orgCity = formInfo.city;
        // 如果有值就进行初始初始化, 没值就用默认值
        addrWin_consts.name.val(formInfo.name );
        addrWin_consts.addrDetail.val(formInfo.addrDetail);
        addrWin_consts.phone.val(formInfo.phone );
        addrWin_consts.postcode.val(formInfo.postcode );
        addrWin_consts.province.val("");
        addrWin_consts.city.val("");
        addrWin_consts.area.val("");
    },
    provinceFilter:function () {
        // 如果省份没选, 城市和区域值也清空
        if (!addrWin_cache.formInfo.province) {
            addrWin_cache.formInfo.province = addrWin_cache.orgProvince;
            if (!addrWin_cache.formInfo.city) {
                addrWin_cache.formInfo.city = addrWin_cache.orgCity;
                if (!addrWin_cache.formInfo.area) {
                    addrWin_cache.formInfo.area = "";
                }
            }
        }
        // 如果城市没选,区域也不选
    },
    showError:function (text) {
        var errWrap = $('.err-alert');
        var errText = $('.err-alert .err-inner');
        // 显示错误文本和样式
        errWrap.css("height","24px");
        errText.text(text).css("display","inline-block");
        // 预清理timer
        clearTimeout(addrWin_cache.timer);
        // 2秒后淡出
        addrWin_cache.timer = setTimeout(function () {
            errText.fadeOut(100);
            errWrap.css({
                "height":"0"
            });
        },2000);
    },
    vertify:function () {

        // 若没有添加收件人
        var result = {
            status:false,
            msg:''
        };
        // 收件人没填写
        if (!addrWin_cache.formInfo.name) {
            result.msg = "请输入收件人";
            return result;
        }
        // 城市信息没填写
        if (!addrWin_cache.formInfo.city || !addrWin_cache.formInfo.province ||  !addrWin_cache.formInfo.area ) {
            result.msg = "请完善城市信息";
            return result;
        }
        if (!addrWin_cache.formInfo.addrDetail) {
            result.msg = "请输入详细地址";
            return result;
        }
        if (!addrWin_cache.formInfo.phone) {
            result.msg = "请输入手机号";
            return result;
        }
        if (!(/^1\d{10}$/.test(addrWin_cache.formInfo.phone))) {
            result.msg = "手机号格式不正确";
            return result;
        }
        if (!addrWin_cache.formInfo.postcode) {
            addrWin_cache.formInfo.postcode = "000000";
        }
        if (addrWin_cache.formInfo.postcode && !(/\d{6}/.test(addrWin_cache.formInfo.postcode ))) {
            result.msg = "邮编地址不正确";
            return result;
        }
        result.status = true;
        return result;
    }
};
var addrWin                 = {

    init            :function () {
        this.bindEvent();

    },
    bindEvent       :function () {
        var _this = this;
        // 打开按钮
        addrWin_consts.openBtn.click(function () {
            addrWin_consts.window.removeClass("hide").addClass("show");
        });
        // 关闭按钮
        addrWin_consts.closeBtn.click(function () {
            addrWin_consts.window.removeClass("show").addClass("hide");
            addrWin_funcs.formClear();

        });
        // 保存按钮
        addrWin_consts.saveAddrBtn.click(function () {
            // 生成表单数据包
            addrWin_funcs.loadCurrentValue();
            addrWin_funcs.provinceFilter();
            // 验证表单数据
            var result = addrWin_funcs.vertify();
            if (!result.status) {
                addrWin_funcs.showError(result.msg);
                return;
            }
            // 调用回调函数, 传入生成的数据包.修改表单

            addrWin_cache.callBackObj.func1(addrWin_cache.formInfo);
            // 清空回调目标
            addrWin_cache.callBackObj = undefined;
            // 关闭窗口
            addrWin_consts.closeBtn.click();
        });

    },
    show            :function (title,formInfo,callBackObj) {
        // 加载标题信息
        addrWin_consts.title.text(title);
        // 传入调永对象的回调引用
        addrWin_cache.callBackObj = callBackObj;
        // 初始化表格
        addrWin_funcs.formInit(formInfo);
        // 显示窗口
        addrWin_consts.openBtn.click();

    },



};

addrWin.init();

module.exports = addrWin;
