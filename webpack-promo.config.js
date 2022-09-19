var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './src_promo/index.js',
    mode: 'development',
    devServer: {
        contentBase: './dist_webapp',
        historyApiFallback: {
            index: 'index.html'
        },
        port: 3000
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: ['babel-loader'],
                include: path.join(__dirname, 'src_promo')
            },
        ]
    },
    output: {
        filename: 'bundle_promo.js',
        path: path.resolve(__dirname, 'dist_webapp'),
    },
};
