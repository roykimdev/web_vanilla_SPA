const webpack = require('webpack'),
      webpackConfig = require('../config/webpack.config.prod'),
      formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')

const compiler = webpack(webpackConfig)

compiler.run((err, stats) => {
  let messages;
  if (err) {
    if (!err.message) {
      return reject(err);
    }

    let errMessage = err.message;

    // Add additional information for postcss errors
    if (Object.prototype.hasOwnProperty.call(err, 'postcssNode')) {
      errMessage +=
        '\nCompileError: Begins at CSS selector ' +
        err['postcssNode'].selector;
    }

    messages = formatWebpackMessages({
      errors: [errMessage],
      warnings: [],
    });
  } else {
    messages = formatWebpackMessages(
      stats.toJson({ all: false, warnings: true, errors: true })
    );
  }
  if (messages.errors.length) {
    // Only keep the first error. Others are often indicative
    // of the same problem, but confuse the reader with noise.
    if (messages.errors.length > 1) {
      messages.errors.length = 1;
    }
    return reject(new Error(messages.errors.join('\n\n')));
  }
  if (messages.warnings.length) {
    console.log(
      chalk.yellow(
        '\nTreating warnings as errors because process.env.CI = true.\n' +
          'Most CI servers set it automatically.\n'
      )
    );
    return reject(new Error(messages.warnings.join('\n\n')));
  }

  const resolveArgs = {
    stats,
    warnings: messages.warnings,
  };

  return resolveArgs
})
