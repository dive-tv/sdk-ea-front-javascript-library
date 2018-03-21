const webpack = require('webpack');
const path = require('path');
const package = require("./package.json");

const version = package.version.replace(/\./g, "-");

// variables
const isProduction = process.argv.indexOf('-p') >= 0 || process.env.NODE_ENV == "production" || process.env.NODE_ENV == "cdn";
let uploadToCDN = process.env.NODE_ENV == "cdn"
const sourcePath = path.join(__dirname, './src');
const outPath = !uploadToCDN ? path.join(__dirname, './dist') : path.join(__dirname, './dist-cdn');
process.env.NODE_ENV = process.env.NODE_ENV == 'cdn' ? "production" : process.env.NODE_ENV;

// plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const extractSASS = new ExtractTextPlugin('[name].css');
const autoPrefixer = require('autoprefixer');
const RemoteDebuggerPlugin = require('remote-debugger-webpack').default;

// console.log("RDP", RemoteDebuggerPlugin);

module.exports = function (publicPath) {
  console.log("__dirname: ", __dirname);
  console.log("WP IS PRODUCTION? ", isProduction);
  console.log("package.version", package.version);
  console.log("version: ", version);
  console.log("file url: ", 'DiveSDK.front-' + version + '.js');
  // throw('ERRO CACA');

  const frontEntry = isProduction ?
    [
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'redux',
      // path.resolve(__dirname, 'src', 'services', 'vimeo-player.js'),
      path.resolve(__dirname, 'src', 'main.tsx'),
    ] :
    [
      'eventsource-polyfill', // Necessary for hot reloading with IE
      `webpack-hot-middleware/client?reload=true&path=${publicPath}__webpack_hmr`,
      // path.resolve(__dirname, 'src', 'services', 'vimeo-player.js'),
      path.resolve(__dirname, 'src', 'main.tsx')
    ];

  const sassEntry = /*ExtractTextPlugin.extract({
    fallback: 'style-loader',
    //resolve-url-loader may be chained before sass-loader if necessary 
    use:*/ [
      {
        loader: "css-loader", // translates CSS into CommonJS
        options: {
          sourceMap: true,
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true,
          plugins: [
            autoPrefixer({
              browsers: ['last 10 versions']
            })
          ]
        }
      },
      'resolve-url-loader',
      {
        loader: "sass-loader", // compiles Sass to CSS
        options: {
          sourceMap: true,
        }
      }
    ]
  //});

  const devtool = isProduction ? 'source-map' : 'inline-source-map';//'source-map'; //'source-map' : 'source-map'; //'cheap-module-source-map' /*'inline-source-map'*/;
  const plugins = isProduction ? [] :
    [
      // Tell webpack we want hot reloading
      new webpack.HotModuleReplacementPlugin(),
    ];
  plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      },
      __ENV__: JSON.stringify(process.env.NODE_ENV),
      __DIVE_ENV__: JSON.stringify('PRO'),
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new HtmlWebpackPlugin({
      template: 'index.html',
    })
  );
  const sourceMapPath = "file:///";
  if (process.env.NODE_ENV === "production") {
    /*plugins.push(
      new UglifyJSPlugin({
        sourceMap: {
          base: "file:///",
        },
        warnings: "verbose",
        // Eliminate comments
        comments: true,
        // Compression specific options
        compress: {
          join_vars: true,
          if_return: true,
          unused: true,
          loops: true,
          booleans: true,
          conditionals: true,
          dead_code: true,
          // remove warnings
          warnings: false,
          // Drop console statements
          drop_console: false,//true
        },
      })
    );*/
  }

  // uploadToCDN = false;

  const config = {
    watch: false,
    context: sourcePath,
    entry: {
      front: frontEntry,
    },
    output: {
      path: outPath,
      //filename: !uploadToCDN ? 'DiveSDK.[name].js' : 'DiveSDK.[name]-' + version + '.js',
      filename: 'DiveSDK.[name].js',
      library: ['DiveSDK', "[name]"],
      libraryTarget: isProduction && !uploadToCDN ? "umd" : "var",
      publicPath: publicPath,
    },
    target: 'web',
    resolve: {
      alias: {
        Main: path.resolve(__dirname, 'src', 'main'),
        Store: path.resolve(__dirname, 'src', 'store', 'store'),
        Components: path.resolve(__dirname, 'src', 'components', 'index'),
        Services: path.resolve(__dirname, 'src', 'services', 'index'),
        Reducers: path.resolve(__dirname, 'src', 'reducers', 'index'),
        Actions: path.resolve(__dirname, 'src', 'actions', 'index'),
        Types: path.resolve(__dirname, 'types', 'index'),
        Containers: path.resolve(__dirname, 'src', 'containers', 'index'),
        Constants: path.resolve(__dirname, 'src', 'constants'),
        HOC: path.resolve(__dirname, 'src', 'HOC', 'index'),
        CardModules: path.resolve(__dirname, 'src', 'components', 'cardDetailComponents', 'cardModules', 'index'),
        Theme: path.resolve(__dirname, 'src', 'scss', 'theme', 'index'),
        Vimeo: path.resolve(__dirname, 'src', 'services', 'vimeo-player'),
      },
      extensions: ['.js', '.ts', '.tsx'],
      // Fix webpack's default behavior to not load packages with jsnext:main module
      // https://github.com/Microsoft/TypeScript/issues/11677
      mainFields: ['main']
    },
    module: {
      rules: [
        // .ts, .tsx
        /*{
          test: /\.(ts|tsx)?$/,
          exclude: /node_modules/,
          use: ['cache-loader', 'babel-loader', 'ts-loader'],
        },*/
        {
          test: /\.(ts|tsx)$/,
          enforce: 'pre',
          loader: 'tslint-loader',
          options: { /* Loader options go here */ }
        },
        { test: /\.(ts|tsx)$/, loader: "cache-loader" },
        { test: /\.(ts|tsx)$/, loader: "babel-loader" },
        { test: /\.(ts|tsx)$/, loader: "ts-loader" },
        // { test: /\.(ts|tsx)$/, loader: "awesome-typescript-loader?configFileName=tsconfig.json" },
        
        // css
        {
          test: /\.css$/,
          use: {
            loader: "style-loader", // creates style nodes from JS strings
            options: {
              sourceMap: true,
              insertInto: '#root',
              attrs: { id: "estilos" }
            }
          }
        },
        {
          test: /\.scss?$/,
          exclude: /node_modules/,
          use: isProduction ? sassEntry : ['css-hot-loader'].concat(sassEntry),
        },
        // static assets
        { test: /\.html$/, use: 'html-loader' },
        {
          test: /\.(jpe?g|png|gif|svg)$/,
          exclude: [/node_modules/, path.resolve(__dirname, '..', 'src', 'assets', 'fonts')],
          loaders: [
            /*{
              loader: 'file-loader',
              options: {
                // name: 'assets/[hash].[ext]',
                // name: path.resolve(__dirname, '..', 'src', 'assets/[hash].[ext]'),
                name: '[path][name].[ext]',
                context: './',
                
                // publicPath: path.resolve(__dirname, '..', 'dist', 'assets'),
                // useRelativePath: false,
                //name: 'https://cdn.dive.tv/sdkweb/assets/[hash].[ext]',
              }
             },*/
            /*{
              loader: 'url-loader',
              options: {
                mimetype: 'image/png',
                fallback: 'responsive-loader'
              }
            },*/
            {
              loader: 'svg-url-loader',
              options: {}
            },
            {
              loader: 'image-webpack-loader',
              query: {
                mozjpeg: {
                  progressive: true,
                },
                gifsicle: {
                  interlaced: false,
                },
                optipng: {
                  optimizationLevel: 4,
                },
                pngquant: {
                  quality: '75-90',
                  speed: 3,
                },
              },
            },
          ],
        }
        /*,
        {
          test: /\.json$/,
          use: 'json-loader',
          exclude: [/node_modules/],

        }*/
      ],
    },
    plugins: plugins,
    devtool,
    node: {
      // workaround for webpack-dev-server issue
      // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
      fs: 'empty',
      net: 'empty'
    },
    target: 'web', // Make web variables accessible to webpack, e.g. window,
  };
  if (!isProduction) {
    config.devServer = {
      hot: true,
      inline: true,
      contentBase: sourcePath,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
      },
      stats: {
        warnings: false
      },
    };
  }

  config.stats = "minimal";

  return config;
}