var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    mode: 'production',
    resolve: {
        extensions: ['.js', '.jsx']
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            PRODUCTION: JSON.stringify(true),
        })
    ],
    target: 'electron-renderer',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: ['babel-loader'],
                include: path.join(__dirname, 'src')
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.svg$/,
                use: [
                    'svg-sprite-loader',
                ]
            }
        ]

    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    }
};
