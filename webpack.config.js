const webpack = require('webpack');
var path = require('path');
var BundleTracker = require('webpack-bundle-tracker');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    entry: {
        app: './src/js/app.js',
        vendor: ['angular', 'd3', 'bootstrap', 'jquery']
    },
    output: {
        filename: 'bundle-[chunkhash:8].js',
        path: path.resolve(__dirname, 'static/dist')
    },
    devtool: 'source-map',
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
                presets: ['es2015']
            }
        }, {
            test: /bootstrap\/dist\/js\/umd\//,
            loader: 'imports?jQuery=jquery'
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        }, {
            test: /\.png$/,
            loader: 'url-loader?publicPath=/static/dist/&limit=100000'
        }, {
            test: /\.jpg$/,
            loader: 'file-loader'
        }, {
            test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
            loader: 'url-loader'
        }],
    },
    plugins: [
        new BundleTracker({
            filename: './webpack-stats.json'
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                screw_ie8: true,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true,
            },
            output: {
                comments: false
            },
        }),
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery',
            jquery: 'jquery'
        }),
        // new BundleAnalyzerPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.bundle.js'
        }),
        new webpack.NamedModulesPlugin()
    ]
}
