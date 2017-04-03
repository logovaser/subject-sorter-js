/**
 * Created by logov on 28-Feb-17.
 */

const webpack = require('webpack'),
    path = require('path');

module.exports = {
    entry: {
        index: './front/base',
        settings: './front/pages/settings',
    },
    output: {
        path: path.join(__dirname, 'public/static'),
        publicPath: '/static/',
        filename: "[name].js"
    },
    devtool: 'source-map',
    plugins: [
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {warnings: false},
        //     output: {comments: false},
        //     sourceMap: true
        // }),
        // new webpack.ProvidePlugin({
        //     $: "jquery",
        //     jQuery: "jquery",
        //     "window.jQuery": "jquery"
        // })
    ],
    module: {
        rules: [
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                use: [{loader: 'file-loader', query: {name: '[name].[ext]'}}]
            }
        ]
    }
};
