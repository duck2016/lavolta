const webpack = require('webpack');
const path = require('path');

module.exports = {
    context: path.join(__dirname),
    devtool: false,
    entry: { main: './application/main' },
    output: {
        filename: `[name].js?_[chunkhash:16]`,
        chunkFilename: `_chunk.[name].js?_[chunkhash:16]`,
        path: path.join(__dirname, `./assets/bundles`),
        publicPath: `/assets/bundles/`
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ]
};