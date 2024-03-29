const { merge } = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const { HashedModuleIdsPlugin } = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const RemoveServiceWorkerPlugin = require('webpack-remove-serviceworker-plugin');

const common = require('./webpack.common.js');

const optimization = {
  minimize: true,
  minimizer: [
    new TerserPlugin({
      terserOptions: {
        warnings: false,
        compress: {
          comparisons: true,
        },
        parse: {},
        mangle: true,
        output: {
          comments: false,
          ascii_only: true,
        },
      },
      parallel: true,
    }),
  ],
  nodeEnv: 'production',
  sideEffects: true,
  concatenateModules: true,
  runtimeChunk: 'single',
  splitChunks: {
    chunks: 'all',
    maxInitialRequests: 10,
    minSize: 0,
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name(module) {
          const packageName = module.context.match(
            /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
          )[1];
          return `npm.${packageName.replace('@', '')}`;
        },
      },
    },
  },
};

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map', 
  entry: [
    path.resolve(__dirname, 'src', 'root.js'), // Start with js/root.js
  ],
  // Utilize long-term caching by adding content hashes (not compilation hashes) to compiled assets
  output: {
    filename: 'bundle.[chunkhash].js',
    chunkFilename: 'bundle.[chunkhash].chunk.js',
    clean: true,
  },
  optimization: optimization,
  plugins: [
    new RemoveServiceWorkerPlugin(),
    new HtmlWebpackPlugin({
      title: "SagaBoilerplate",
      template: path.join(process.cwd(), 'public', 'index.html'),
      filename: 'index.html',
      hash: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      stats: {
        children: false,
      },
      inject: true,
    }),
    new WebpackPwaManifest({
      // ADDED FOR STORE
      prefer_related_applications: true,
      related_applications: [
        {
          platform: 'play',
          id: 'com.sagaboilerplate.app',
        },
      ],
      name: 'SagaBoilerplate',
      short_name: 'SagaBoilerplate',
      description: 'SagaBoilerplate',
      background_color: '#fafafa',
      theme_color: '#b1624d',
      inject: true,
      ios: true,
      icons: [
        {
          src: path.resolve(process.cwd(), 'public/images/icon-512x512.png'),
          sizes: [72, 96, 128, 144, 192, 384, 512],
        },
        {
          src: path.resolve(process.cwd(), 'public/images/icon-512x512.png'),
          sizes: [120, 152, 167, 180],
          ios: true,
        },
      ],
    }),

    new HashedModuleIdsPlugin({
      hashFunction: 'sha256',
      hashDigest: 'hex',
      hashDigestLength: 20,
    }), 
  ].filter(Boolean),
  performance: {
    assetFilter: assetFilename =>
      !/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename),
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
});