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
                              loader: require.resolve('postcss-loader'),
                              options: {
                                ident: 'postcss',
                                plugins: () => [
                                  require('postcss-flexbugs-fixes'),
                                  require('postcss-preset-env')({
                                    autoprefixer: {
                                      flexbox: 'no-2009',
                                    },
                                    stage: 3,
                                    browsers: 'cover 99.5%',
                                  }),
                                ],
                                sourceMap: false,
                              },
                            },
                          ].filter(Boolean)

                          return loaders
                        }

module.exports = {
  mode: 'production',
  entry: {
    app: './src/index.js'
  },
  output: {
    path: __dirname + '/../public',
    filename: 'roy-[name].[chunkhash].js',
    publicPath: '/',
    sourceMapFilename: 'roy-[name].map',
    chunkFilename: 'roy-[id].[chunkhash].js',
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
            minimize: true,
          },
        },
      },
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: getStyleLoaders({
          importLoaders: 1,
          sourceMap: false,
        }),
        sideEffects: true,
      },
      {
        test: /\.module\.css$/,
        use: getStyleLoaders({
          importLoaders: 1,
          sourceMap: false,
          modules: true,
        }),
      },
    ]
  },
  optimization: {
    mangleWasmImports: true,
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: false,
        terserOptions: {
          compress: {
            drop_console: true,
          },
          toplevel: true,
          output: {
            beautify: false,
            comments: false,
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
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      maxSize: 1000000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 4,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'all',
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      }
    },
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      DEBUG: false
    }),
    new ProgressBarPlugin(),
    new MiniCssExtractPlugin({
      filename: 'roy-[name].[contenthash:8].css',
      chunkFilename: 'roy-[name].[contenthash:8].chunk.css',
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
