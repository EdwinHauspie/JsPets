const path = require('path')

function resolve(dir) {
    return path.resolve(__dirname, dir)
}

module.exports = {
    entry: './src/index.js',
    output: {
        path: resolve('dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src')]
            },
            {
                test: /\.css$/,
                loader: ['style-loader', 'css-loader']
            }
        ]
    }
}