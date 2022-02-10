'use strict';
const webpack = require('webpack'),
      WebpackDevServer = require('webpack-dev-server'),
      webpackConfig = require('../config/webpack.config.dev'),
      devServer = new WebpackDevServer(webpack(webpackConfig)),
      numPort = 8080

devServer.listen(numPort, err => {
  if (err) return console.log(err)
  console.log(`Server running at http://localhost:${numPort}`)
})


process.on('unhandledRejection', err => {
  throw err;
})