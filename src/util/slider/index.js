/*
 * @Author: Avenda
 * @Date: 2018/10/10
 */
require('./index.css');
require('./unslider.min.js');
// 属性设置
var slider = {
    init:function () {
        //初始化
        var html = require('./slider-content.string');
        $('#banner-main-content').html(html);
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
module.exports = slider;


// 事件