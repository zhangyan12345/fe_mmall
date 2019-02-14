/*
 * @Author: Avenda
 * @Date: 2018/10/24
 */

module.exports = {
    plugins: [
        require('cssnano'),
        // require('precss'),    // 此项会导致css-next中的autoprefixer产生两个css样式
        // cssnext中 已经包含autoprefixer↓
        require('autoprefixer'),
        // require('postcss-cssnext'),
        // 开启雪碧图
        // require('postcss-sprites')({
        //     basePath:'./src/assets/imgs2',
        //     spritePath:'src/assets/imgs/sprites',
        //     // 开启retina屏图标  图片名字后加上@2x,然后图标大小改为原来的一半
        //     retina:true,
        //     filterBy: function (image) {
        //         //过滤一些不需要合并的图片，返回值是一个promise，默认有一个exist的filter
        //         //打包路径中包含ico2的图片
        //         if (image.url.indexOf('ico2') >=0) {
        //             return Promise.resolve();
        //         }
        //         return Promise.reject();
        //
        //     },
        // }),
    ]
};