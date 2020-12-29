var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    mode: 'development',
    devServer: {
        contentBase: './dist',
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
            include: path.join(__dirname, 'src')
        },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};
