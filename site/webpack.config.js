/**
 * Created by logov on 28-Feb-17.
 */

const webpack = require('webpack'),
    path = require('path');

module.exports = {
    entry: {
        main: './front/base',
    },
    output: {
        path: path.join(__dirname, 'public/static'),
        publicPath: '/static/',
        filename: "[name].js"
    },
    devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development')
                // NODE_ENV: JSON.stringify('production')
            }
        }),
        // new webpack.optimize.UglifyJsPlugin({
        //     // compress: {warnings: true},
        //     comments: false,
        //     // sourceMap: true
        // })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', {
                    loader: 'css-loader',
                    // options: {minimize: true}
                }]
            },
            {
                test: /\.less$/,
                use: ['style-loader', {
                    loader: 'css-loader',
                    // options: {minimize: true}
                }, 'less-loader']
            },
            {
                test: /\.(html)$/,
                use: [
                    'raw-loader',
                    // 'html-minify-loader'
                ]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                use: [{loader: 'file-loader', query: {name: '[name].[ext]'}}]
            }
        ]
    }
};
