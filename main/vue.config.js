// const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')
module.exports = {
    publicPath: '/', //部署应用时的根路径(默认'/'),也可用相对路径(存在使用限制)
    outputDir: 'dist', //运行时生成的生产环境构建文件的目录(默认'dist'，构建之前会被清除)
    assetsDir: '', //静态资源目录(js、css、img、fonts)，相对outputDir的目录(默认'')
    indexPath: 'index.html', //指定生成index.html的输出路径(相对outputDir)也可以是绝对路径
    lintOnSave: true, //是否开启ESlint（保存时检查）
    productionSourceMap: true, //生产环境是否生成  sourceMap文件
    pages: {
        //pages里配置的路径和文件名在你的文档目录必须存在，否则启动服务会报错
        index: {
            //除了 entry 之外都是可选的
            entry: 'src/main.js', //page的主入口
            template: 'public/index.html', //模板来源
            filename: 'index.html', //在 dist/index.html 的输出
            //title在template中使用：<title><%=htmlWebpackPlugin.options.title%></title>
            title: 'qiankun多页签demo',
            chunks: ['chunk-vendors', 'chunk-common', 'index']
            // 在这个页面中包含的块，默认情况下会包含,提取出来的通用 chunk 和 vendor chunk
        }
        // subpage: 'src/subpage/main.js'
        //官方解释：当使用只有入口的字符串格式时，模板会被推导为public/subpage.html
        //若找不到就回退到public/index.html，输出文件名会被推导为subpage.html
    },
    css: {
        // 将组件内的 CSS 提取到一个单独的 CSS 文件 (只用在生产环境中)
        // 也可以是一个传递给 `extract-text-webpack-plugin` 的选项对象
        extract: true,

        // 是否开启 CSS source map？
        sourceMap: true,
        // 为所有的 CSS 及其预处理文件开启 CSS Modules。
        // 这个选项不会影响 `*.vue` 文件。
        // modules: falseindustrySectorMap,
        loaderOptions: {
            less: {
                // prependData: `@import "@/style/style.scss";`
            }
        }
    },
    devServer: {
        //环境配置
        host: "127.0.0.1",
        port: 5200,
        https: true, //是否开启https
        hot: true, //是否配置热更新
        open: true, //配置自动启动浏览器
    },
    // eslint-disable-next-line no-dupe-keys
    configureWebpack: config => {
        Object.assign(config, {
            // 开发生产共同配置
            resolve: {
                extensions: ['.js', '.vue', '.json'],
                alias: {
                    '@': path.resolve(__dirname, './src'),
                    '@c': path.resolve(__dirname, './src/components'),
                    '@p': path.resolve(__dirname, './public'),
                }
            }
        })
     
    },

    pluginOptions: {
        // 第三方插件配置
        // ...
    }
}
