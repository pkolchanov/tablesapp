var path = require('path');
var webpack = require('webpack');
const {spawn} = require('child_process');

module.exports = {
    entry: './src/index.js',
    mode: 'development',
    devServer: {
        contentBase: './dist',
        stats: {
            colors: true,
            chunks: false,
            children: false
        },
        before() {
            spawn(
                'npx electron',
                ['.'],
                {shell: true, env: process.env, stdio: 'inherit'}
            )
                .on('close', code => process.exit(0))
                .on('error', spawnError => console.error(spawnError));
        }
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
            PRODUCTION: JSON.stringify(false),
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
                test: /\.(scss|css)$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.svg$/,
                use: [
                    'svg-sprite-loader',
                    // 'svgo-loader'
                ]
            }
        ]

    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    }
};
