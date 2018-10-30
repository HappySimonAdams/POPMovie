const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        cesium: './src/Cesium-1.46/Cesium.js',
        three: './src/Three-94/Three.js',
        index: './app/index.js'
    },
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'build'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './app/index.html'
        }),

        new CopyWebpackPlugin([{from: './src/Cesium-1.46/Assets', to: 'cesium/Assets'}]),
        new CopyWebpackPlugin([{from: './src/Cesium-1.46/Workers', to: 'cesium/Workers'}]),
        new webpack.DefinePlugin({CESIUM_BASE_URL: JSON.stringify('./cesium/')}),

        new CopyWebpackPlugin([{from: './app/css', to: 'css'}]),
        new CopyWebpackPlugin([{from: './resource', to: 'resource'}]),

        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery'
        }),

        // new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ],
    devtool: 'eval',
    devServer: {
        contentBase: path.join(__dirname, "build"),
        port: 9093,
        hot: true,
        /*proxy: {
            '*': {
                target: 'https://www.pop.movie',
                changeOrigin: true,
                secure: false
            }
        }*/
    }
}