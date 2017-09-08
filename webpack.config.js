var webpack = require('webpack');
var path = require('path');

// variables
var isProduction = process.argv.indexOf('-p') >= 0;
var sourcePath = path.join(__dirname, './src');
var outPath = path.join(__dirname, './dist');

// plugins
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractSASS = new ExtractTextPlugin('[name].css');

module.exports = {
  context: sourcePath,
  entry: {
    main: [
      path.resolve(__dirname, 'src', 'main.tsx'),
    ],
    styles: [
      path.resolve(__dirname, 'src', 'scss', 'main.scss'),
    ],
    vendor: [
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'redux'
    ]
  },
  output: {
    path: outPath,
    publicPath: '/',
    filename: 'DiveSDK.[name].js',
    library: ['DiveSDK', "[name]"],
    libraryTarget: 'umd',
  },
  target: 'web',
  resolve: {
    alias: {
      Components: path.resolve(__dirname, 'src', 'components', 'index'),
      Services: path.resolve(__dirname, 'src', 'services', 'index'),
      Reducers: path.resolve(__dirname, 'src', 'reducers', 'index'),
      Actions: path.resolve(__dirname, 'src', 'actions', 'index'),
      Types: path.resolve(__dirname, 'types', 'index'),
      Containers: path.resolve(__dirname, 'src', 'containers', 'index'),
      Constants: path.resolve(__dirname, 'src', 'constants'),
      HOC: path.resolve(__dirname, 'src', 'HOC', 'index'),
      CardModules: path.resolve(__dirname, 'src', 'components', 'cardDetail', 'cardModules', 'index'),
    },
    extensions: ['.js', '.ts', '.tsx'],
    // Fix webpack's default behavior to not load packages with jsnext:main module
    // https://github.com/Microsoft/TypeScript/issues/11677
    mainFields: ['main']
  },
  module: {
    loaders: [
      // .ts, .tsx
      {
        test: /\.(ts|tsx)?$/,
        use: isProduction
          ? 'awesome-typescript-loader?module=es6&configFileName=tsconfig.json'
          : [
            'react-hot-loader',
            'awesome-typescript-loader?configFileName=tsconfig.json'
          ]
      },
      // css
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              query: {
                modules: true,
                sourceMap: !isProduction,
                importLoaders: 1,
                localIdentName: '[local]__[hash:base64:5]'
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: [
                  require('postcss-import')({ addDependencyTo: webpack }),
                  require('postcss-url')(),
                  require('postcss-cssnext')(),
                  require('postcss-reporter')(),
                  require('postcss-browser-reporter')({ disabled: isProduction }),
                ]
              }
            }
          ]
        })
      },
      {
        test: /\.scss?$/,
        use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
          fallback: 'style-loader',
          //resolve-url-loader may be chained before sass-loader if necessary 
          use: [
            {
              loader: "css-loader", // translates CSS into CommonJS
              options: { sourceMap: true /*process.env.NODE_ENV !== 'production'*/ }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  require('autoprefixer')({
                    browsers: ['last 10 versions']
                  })
                ]
              }
            },
            //'resolve-url-loader',
            {
              loader: "sass-loader", // compiles Sass to CSS
              options: { sourceMap: true }
            }
          ]
        }))
      },
      // static assets
      { test: /\.html$/, use: 'html-loader' },
      { test: /\.png$/, use: 'url-loader?limit=10000' },
      { test: /\.jpg$/, use: 'file-loader' },
      {
        test: /\.(svg)$/,
        exclude: ['node_modules', path.resolve(__dirname, '..', 'src', 'assets', 'fonts')],
        use: [
          {
            loader: "file-loader",
            query: {
              name: 'assets/svg/[name].[ext]'
            }
          }
        ]
      },
      { test: /\.json$/, use: 'json-loader' }
    ],
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.bundle.js',
      minChunks: function (module) {
        // this assumes your vendor imports exist in the node_modules directory
        return module.resource && (/node_modules/).test(module.resource);
      }
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new ExtractTextPlugin(
      '[name].css', {
        allChunks: false
      }
    ),
    new HtmlWebpackPlugin({
      template: 'index.html'
    })
  ],
  devtool: (function () {
    // if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev') {
    return 'inline-source-map';
    // }
    // else {
    //   return 'source-map';
    // }
  })(),
  devServer: {
    contentBase: sourcePath,
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    },
    stats: {
      warnings: false
    },
  },
  node: {
    // workaround for webpack-dev-server issue
    // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
    fs: 'empty',
    net: 'empty'
  }
};
