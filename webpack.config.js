var path = require('path');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

var webpackConfig = {
    mode: 'production',
    entry: {
        bundle: './src/VizzyUtilsContainer.tsx',
    },
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
        library: '[name]',
        libraryTarget: 'umd',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        modules: [path.join(__dirname, '../src'), 'node_modules'],
    },
    plugins: [new UglifyJSPlugin()],
    module: {
        rules: [
            { test: /\.(js|jsx)$/, use: 'babel-loader' },
            { test: /\.ts(x?)$/, loader: 'ts-loader' },
            { test: /\.css$/, loader: ['to-string-loader', 'css-loader'] },
        ],
    },
};

module.exports = webpackConfig;
