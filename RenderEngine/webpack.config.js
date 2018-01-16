const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

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
                include: [resolve('src')]
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: 'css-loader'
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('app.css')
    ]
}