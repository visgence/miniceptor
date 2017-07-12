const webpack = require('webpack');
var path = require('path');
var BundleTracker = require('webpack-bundle-tracker');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './src/js/app.js',
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
    },
    {
      test: /bootstrap\/dist\/js\/umd\//,
      loader: 'imports?jQuery=jquery'
    },
    {
        test: /\.css$/,
        loader: "style-loader!css-loader"
    },
    {
        test: /\.png$/,
        loader: "url-loader?publicPath=/static/dist/&limit=100000"
    },
    {
        test: /\.jpg$/,
        loader: "file-loader"
    },
    {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?publicPath=/static/dist/&limit=10000&mimetype=application/font-woff'
    },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?publicPath=/static/dist/&limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?publicPath=/static/dist/&limit=10000&mimetype=image/svg+xml'
      }
    ],
  },
  plugins: [
    new BundleTracker({filename: './webpack-stats.json'}),
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
    })
  ]
};
