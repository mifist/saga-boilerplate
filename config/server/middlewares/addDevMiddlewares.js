const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const path = require('path');
const express = require('express');

const ROOT_PATH = path.resolve(process.cwd());
const webpackConfig = require(path.join(ROOT_PATH, 'config', 'webpack', 'webpack.dev.js'));
function createWebpackMiddleware(compiler, publicPath) {
  return webpackDevMiddleware(compiler, {
    publicPath,
    stats: 'errors-warnings',
  });
}

/* 
'errors-only'	none	Only output when errors happen
'errors-warnings'	none	Only output errors and warnings happen
'minimal'	none	Only output when errors or new compilation happen
'none'	false	Output nothing
'normal'	true	Standard output
'verbose'	none	Output everything
'detailed'	none	Output everything except chunkModules and chunkRootModules
'summary'	none	Output webpack version, warnings count and errors count
*/

module.exports = function addDevMiddlewares(app) {
  const publicPath = webpackConfig?.output?.publicPath;
  const outputPath = webpackConfig?.output?.path;
  const indexPath = path.resolve(outputPath, 'index.html');

  const compiler = webpack(webpackConfig);

  const middleware = createWebpackMiddleware(
    compiler,
    webpackConfig.output.publicPath,
  );
  
  app.use(middleware);
  app.use(webpackHotMiddleware(compiler, {
    path: '/__webpack_hmr',
    heartbeat: 2000,
  }));

  app.use(publicPath, express.static(outputPath));

  app.get('/*', (req, res) => {
    res.sendFile(indexPath)
  }); 

};
