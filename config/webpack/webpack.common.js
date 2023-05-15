/**
 * COMMON WEBPACK CONFIGURATION
 */

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

const envKeys = require(path.resolve(process.cwd(), 'config', 'environment', 'index.js'));

let enviromentConstant;
if (envKeys && Object.keys(envKeys).length > 0) {
  enviromentConstant = Object.keys(envKeys).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(envKeys[next]); //eslint-disable-line
    return prev;
  }, {});
} else {
  throw new Error(
    '.env file is missing kindly add one by making a copy of the .env-example file as saving as .env',
  );
}

if (process.env.BASE_ENV == 'local') {
console.log({ envKeys });
}

/** ---- end block ---- */
module.exports = {
  devtool: 'source-map',
  target: 'web', // Make web variables accessible to webpack, e.g. window
  entry:  [
    require.resolve('react-app-polyfill/ie11'),
    require.resolve('react-app-polyfill/stable'),
  ],
  output: {
    publicPath: '/',
    path: path.resolve(process.cwd(), 'build'),
    clean: false,
    libraryTarget: 'umd',
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new webpack.EnvironmentPlugin({
      ...envKeys,
      NODE_ENV: envKeys.env,
      BASE_ENV: envKeys.envBase,
    }),
    // Makes the public URL available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="icon" href="%PUBLIC_URL%/favicon.ico">
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
      PUBLIC_URL: `/${envKeys.public}`,
      // You can pass any key-value pairs, this was just an example.
      // WHATEVER: 42 will replace %WHATEVER% with 42 in index.html.
    }),
    new webpack.DefinePlugin(envKeys),
    new LodashModuleReplacementPlugin(),
  ].filter(Boolean),
  resolve: {
    modules: ['node_modules', envKeys.rootFolder],
    extensions: ['.js', '.jsx', '.react.js'],
    mainFields: ['browser', 'jsnext:main', 'main'],
    alias: {
      'public': path.join(envKeys.root, 'public'),
      //   'config': path.join(envKeys.root, 'config'),
      'src': path.join(envKeys.root, envKeys.rootFolder),
      'store': path.join(envKeys.root, envKeys.rootFolder, 'store'),
      'shared': path.join(envKeys.root, envKeys.rootFolder, 'shared'),
      'theme': path.join(envKeys.root, envKeys.rootFolder, 'theme'),
      'engine': path.join(envKeys.root, envKeys.rootFolder, 'engine'),
      'layouts': path.join(envKeys.root, envKeys.rootFolder, 'layouts'),
      'legacy': path.join(envKeys.root, envKeys.rootFolder, 'legacy'),
      'appCapacitor': path.join(envKeys.root, envKeys.rootFolder, 'engine', 'appCapacitor'),
      'appContext': path.join(envKeys.root, envKeys.rootFolder, 'engine', 'context'),
      'appHooks': path.join(envKeys.root, envKeys.rootFolder, 'engine', 'hooks'),
      'appAPI': path.join(envKeys.root, envKeys.rootFolder, 'engine', 'api'),
      'utils': path.join(envKeys.root, envKeys.rootFolder, 'utils'),
      // other
      'mobile': path.join(envKeys.root, envKeys.rootFolder, 'mobile'),
      'pages': path.join(envKeys.root, envKeys.rootFolder, 'pages'),

      'images': path.join(envKeys.root, 'public', 'images'),

      'containers': path.join(envKeys.root, envKeys.rootFolder, 'shared', 'containers'),
      'components': path.join(envKeys.root, envKeys.rootFolder, 'shared', 'components'),
      // capacitor
      'android': path.join(envKeys.root, envKeys.rootFolder, 'android'),
      'ios': path.join(envKeys.root, envKeys.rootFolder, 'ios'),
    },
    /* Starting from webpack version 5, polyfills for Node.js core modules are no longer included by default. Therefore, you need to configure webpack to provide fallbacks or polyfills for these missing modules. */
    fallback: {
      os: false,
      fs: false,
      util: false,
      assert: false,
      stream: false,
      constants: false,
      /*       util: require.resolve('util/'),
      assert: require.resolve('assert/'),
      stream: require.resolve('stream-browserify'),
      constants: require.resolve('constants-browserify') */
    }
  },
  performance: {
    hints: "error",
    maxEntrypointSize: 1024000000,
    maxAssetSize: 1024000000,
  },
  module: {
    rules: [
      {
        test: /\.(m?js|jsx?)$/, // Transform all .js files required somewhere with Babel
        exclude: "/node_modules/",
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
           // plugins: ['react-hot-loader/babel'],
           // plugins: ["lodash"],
            // @remove-on-eject-end
            // This is a feature of `babel-loader` for webpack (not Babel itself).
            // It enables caching results in ./node_modules/.cache/babel-loader/
            // directory for faster rebuilds.
            cacheDirectory: false,
          }
        },
      },
      {
        // Preprocess our own .css files
        // This is the place to add your own loaders (e.g. sass/less etc.)
        // for a list of loaders, see https://webpack.js.org/loaders/#styling
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
      {
        // Preprocess 3rd party .css files located in node_modules
        test: /\.css$/,
        include: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.less$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          {
            loader: 'less-loader', // compiles Less to class
            options: {
              lessOptions: {
                javascriptEnabled: true,
                modifyVars: {
                  'primary-color': '#005D9F', // primary color for all components
                  'link-color': '#005D9F', // link color
                  'font-family': 'Roboto', // link color
                  // 'success-color': #52c41a' // success state color
                  // 'warning-color': #faad14' // warning state color
                  // 'error-color': #f5222d' // error state color
                  // 'font-size-base': 14px' // major text font size
                  // 'heading-color': rgba(0, 0, 0, 0.85)' // heading text color
                  // 'text-color': rgba(0, 0, 0, 0.65)' // major text color
                  // 'text-color-secondary': rgba(0, 0, 0, 0.45)' // secondary text color
                  // 'disabled-color': rgba(0, 0, 0, 0.25)' // disable state color
                  'border-radius-base': '5px', // major border radius
                  // 'border-color-base': '#661AFF',// major border color
                  // 'box-shadow-base': 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08),
                  //   0 9px 28px 8px rgba(0, 0, 0, 0.05)' // major shadow for layers
                },
              },
            },
          },
        ],
      },
      {
        test: /\.(ico|eot|otf|ttf|woff|woff2|mp3|wav|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets',
            },
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              // Inline files smaller than 10 kB
              limit: 10 * 1024,
              name(resourcePath, resourceQuery) {
                // `resourcePath` - `/absolute/path/to/file.js`
                // `resourceQuery` - `?foo=bar`
                if (process.env.BASE_ENV == 'local' || process.env.BASE_ENV == 'development') {
                  return '[path][name].[ext]';
                }
                return '[contenthash].[ext]';
              },
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4
              },
              gifsicle: {
                interlaced: false,
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75
              }
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.(mp4|webm)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
          },
        },
      },
    ]
  },
};
