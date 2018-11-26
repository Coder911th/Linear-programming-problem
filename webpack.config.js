'use strict';

const developmentMode = true,       // Если true, то режим разработки, иначе - production
    watch = true,                   // Автосборка при сохранении
    fileProtocolMode = false,       // Для тестирования в файловой системе
    outputFolderName = '/web',     // Имя папки со сборкой
    inputFolderName = 'source',     // Имя папки с исходниками
    webpack = require('webpack'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin');
	
module.exports = {
    context: __dirname + '/' + inputFolderName,
    entry: {
        polifill: './polyfill.js',
        main: './main'
    },
    output: {
        path: __dirname + outputFolderName + '/js',
        publicPath: fileProtocolMode ? __dirname.replace(/\\/g, '/') +  outputFolderName + '/js/' : '/js/',
        filename: './[name].js',
        library: 'global'
    },

    watch: developmentMode && watch,
    watchOptions: {
        aggregateTimeout: 300
    },

    devtool: developmentMode ? 'inline-source-map' : false,
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            developmentMode: developmentMode
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common'
        }),
        new ExtractTextPlugin('../styles/[name].css', {
            allChunks: true
        }),
        new HtmlWebpackPlugin({
            filename: '../index.html',
            template: './index.pug'
        }),
		new webpack.ProvidePlugin({
			'fetch': 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
		})
    ],

    resolve: {
        modules: ['node_modules'],
        extensions: ['.js']
    },

    resolveLoader: {
        modules: ['node_modules'],
        moduleExtensions: ['-loader'],
        extensions: ['.js']
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules|bower_components/,
                include: __dirname + '\\' + inputFolderName,
                loader: 'babel',
                query: {
                    presets: [
                        ['env', {
                            targets: {
                                'browsers': ['last 2 versions', 'ie > 9']
                            }
                        }]
                    ]
                }
            },
            {
                test: /\.pug$/,
                loader: 'pug',
                options: {
                    pretty: false
                }
            },
            {
                test: /.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style',
                    use: [
                        'css',
                        {
                            loader: 'postcss',
                            options: {
                                ident: 'postcss',
                                plugins: (loader) => [
                                    require('autoprefixer')()
                                ]
                            }
                        },
                        'sass'
                    ]
                })
            },
            {
                test: /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
                loader: 'url',
                options: {
                    name: '../images/[path][name].[ext]',
                    limit: 4096
                }
            }
        ]
    }
};
/*
if (!developmentMode) {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: true,
                unsafe: true
            }
        })
    );
}
*/