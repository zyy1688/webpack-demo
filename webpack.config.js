const path=require('path')
const HTMLPlugin=require('html-webpack-plugin')
const webpack=require('webpack')
const ExtractPlugin=require('extract-text-webpack-plugin')
const isDev=process.env.NODE_ENV==='development'
var config ={
    output:{
        path:path.join(__dirname,'dist')
    },
    module:{
        rules:[
            {
                test:/\.vue$/,
                loader:'vue-loader'
            },

            {
                test:/\.styl/,
                use:[
                    'style-loader',//插入到html中
                    'css-loader',
                    'stylus-loader'//顺序依次执行
                ]
            },
            {
                test:/\.(.gif|jpg|png)$/,
                use:[
                    {
                        loader:'url-loader',//封装了file-loader
                        options:{
                            limit:1024,//大于这个值会单独打包成图片
                            name:'[name]-ccc.[ext]'
                        }
                    }

                ]
            }
        ]
    },
    plugins:[
        new webpack.DefinePlugin({
            'process.env':{
                NODE_ENV:isDev?'"development"':'"production"'
            }
        }),
        new HTMLPlugin()//用来加载资源的html
    ]
}
if(isDev)
{
    config.entry= path.join(__dirname,'src/index.js')
    config.output.filename= 'bundle.[chunkhash:8].js'
    config.devtool='#cheap-module-eval-source-map'
    config.devServer={
        port:8086,
        host:'0.0.0.0',//既可以用localhost访问也可以用ip访问
     /*   hot:true,*/
        open:true//自动新的页面
    }
    config.module.rules.push(
        {
            test:/\.css$/,
            use:[
                'style-loader',
                'css-loader'
            ]
        }
    )
   config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),//热更新需要用到
        new webpack.NoEmitOnErrorsPlugin()
    )
}
else
{
    config.entry={
        app:path.join(__dirname,'src/index.js'),//打包程序应用
        vendor:['vue']//打包依赖应用
    }
    config.output.filename= '[name].[chunkhash:8].js'//chunkhash是根据app和vendor打包的
    config.module.rules.push(
        {
            test:/\.css$/,
            use:ExtractPlugin.extract({
                fallback:'style-loader',
                use:[
                    'css-loader'
                ]
            })
        }
    )
    config.plugins.push(
        new ExtractPlugin('styles.[contentHash:8].css'),//css单独打包成文件
        new webpack.optimize.CommonsChunkPlugin({
            name:'vendor'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name:'runtime' //webpack 的代码单独打包
        })
    )
}

module.exports=config

