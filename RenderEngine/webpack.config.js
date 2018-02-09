const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

function resolve(dir) {
    return path.resolve(__dirname, dir)
}

module.exports = {
    entry: './src/index.js',
    output: {
        path: resolve('dist'),
        filename: 'app.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                //include: [resolve('src')]
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({ use: 'css-loader' })
            },
            {
                test: /views.+\.js$/,
                use: ['babel-loader', './view-loader.js']
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('app.css'),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: true
        }),
        /*new CopyWebpackPlugin([
            { from: resolve('src/views/'), to: resolve('dist/views/') }
        ])*/
        //new UglifyJsPlugin()
    ],
    devServer: {
        historyApiFallback: true
    }
}