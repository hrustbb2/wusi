const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const webpack = require('webpack');

module.exports = env => {
    let config = {};
    config.plugins = [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'jquery': 'jquery'
        }),
        new HardSourceWebpackPlugin()
    ]
    
    if(env === undefined || !env.production) {
        config.devtool = 'inline-source-map';
    }else {
        config.plugins.push(
            new UglifyJSPlugin({
                sourceMap: false
            })
        );
    }

    config.entry = {
        wysi: [
            './Main.ts'
        ],
    };
    config.module = {
        rules: [
            {
                test: /\.ts?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: 'tsconfig.webpack.json'
                        }
                    }
                ],
                exclude: /node_modules/
            }
        ]
    };
    config.resolve = {
        extensions: [ '.tsx', '.ts', '.js' ],
        alias: {
            jquery: path.resolve(__dirname, 'node_modules/jquery/dist/jquery'),
        }
    };
    config.output = {
        filename: '[name].js',
        path: path.resolve(__dirname, '../app')
    }

    return config;
}