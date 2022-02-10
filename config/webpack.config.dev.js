const path = require('path'),
      HtmlWebPackPlugin = require('html-webpack-plugin'),
      webpack = require('webpack'),
      TerserPlugin = require('terser-webpack-plugin'),
      ProgressBarPlugin = require('progress-bar-webpack-plugin'),
      MiniCssExtractPlugin = require('mini-css-extract-plugin'),
      ManifestPlugin = require('webpack-manifest-plugin'),
      OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'),
      safePostCssParser = require('postcss-safe-parser'),
      getStyleLoaders = (cssOptions, preProcessor) => {
                          let loaders = [
                            {
                              loader: MiniCssExtractPlugin.loader,
                              options: {
                                publicPath: '/',
                              },
                            },
                            {
                              loader: require.resolve('css-loader'),
                              options: cssOptions,
                            },
                            {
                              loader: 'postcss-loader',
                              options: {
                                postcssOptions: {
                                  plugins: [
                                    [
                                      'postcss-preset-env',
                                    ],
                                  ],
                                },
                              },
                            },
                          ].filter(Boolean)

                          return loaders
                        }

module.exports = {
  mode: 'development',
  entry: {
    app: './src/index.js'
  },
  output: {
    path: __dirname + '/../public',
    filename: '[name].[chunkhash].js',
    publicPath: '/',
    sourceMapFilename: '[name].map',
    chunkFilename: '[id].[chunkhash].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
            ],
            plugins: [
              "@babel/plugin-transform-async-to-generator",
              "@babel/plugin-transform-runtime",
              "@babel/plugin-syntax-dynamic-import",
              "@babel/plugin-syntax-class-properties",
              "@babel/plugin-proposal-class-properties",
              "@babel/plugin-proposal-function-bind",
            ]
          }
        }
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            minimize: false,
          },
        },
      },
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: getStyleLoaders({
          importLoaders: 1,
          sourceMap: true,
        }),
        sideEffects: true,
      },
      {
        test: /\.module\.css$/,
        use: getStyleLoaders({
          importLoaders: 1,
          sourceMap: true,
          modules: true,
        }),
      },
    ]
  },
  devtool: 'cheap-module-source-map',
  optimization: {
    mangleWasmImports: false,
    minimize: false,
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        terserOptions: {
          compress: false,
          toplevel: true,
          output: {
            beautify: true,
            comments: true,
          }
        },
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          parser: safePostCssParser,
          map: {
            inline: true,
            annotation: false,
          }
        },
      }),
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      DEBUG: true
    }),
    new ProgressBarPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[name].[contenthash:8].chunk.css',
    }),
    new ManifestPlugin({
      filename: 'asset-manifest.json',
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/),
  ],
  resolve: {
    modules: [ 'node_modules' ],
    extensions: ['.js', '.json', '.css', '.module' ]
  },
}
