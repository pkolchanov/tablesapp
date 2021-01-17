var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './src_webapp/index.js',
    mode: 'development',
    devServer: {
        contentBase: './dist_webapp',
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        rules: [{
            test: /\.jsx?$/,
            use: ['babel-loader'],
            include: [path.join(__dirname, 'src_web'), path.join(__dirname, 'src')]
        },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist_webapp'),
    },
};
