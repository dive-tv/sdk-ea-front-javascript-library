const webpack = require('webpack');
const path = require('path');

// variables
const isProduction = process.argv.indexOf('-p') >= 0 || process.env.NODE_ENV == "production";
const sourcePath = path.join(__dirname, './src');
const outPath = path.join(__dirname, './dist');

// plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractSASS = new ExtractTextPlugin('[name].css');
const autoPrefixer = require('autoprefixer');

console.log("WP IS PRODUCTION? ", isProduction);
const publicPath = isProduction ? '/api-front-library-react/' : '/';

const frontEntry = isProduction ?
  [path.resolve(__dirname, 'src', 'main.tsx')] :
  [
    'eventsource-polyfill', // Necessary for hot reloading with IE
    'webpack-hot-middleware/client?reload=true',
    path.resolve(__dirname, 'src', 'main.tsx')
  ];

const sassEntry = ExtractTextPlugin.extract({
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
      options: { sourceMap: true }
    }
  ]
});

const devtool = isProduction ? 'source-map' : 'inline-source-map';
const plugins = isProduction ? [] : [new webpack.HotModuleReplacementPlugin()]; // Tell webpack we want hot reloading
plugins.push(
  new webpack.DefinePlugin({
    __ENV__: JSON.stringify(process.env.NODE_ENV),
    __DIVE_ENV__: JSON.stringify('PRO'),
  }),
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
      disable: false,
      allChunks: true
    }
  ),
  new HtmlWebpackPlugin({
    template: 'index.html',
    // excludeChunks: ['styles']
  })
);
const sourceMapPath = "file:///";
if (process.env.NODE_ENV === "production") {
    plugins.push(
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
                drop_console: true
            },
        })
    );
}

const config = {
  context: sourcePath,
  entry: {
    front: frontEntry,
    styles: [
      // 'webpack-hot-middleware/client?reload=true',
      path.resolve(__dirname, 'src', 'scss', 'main.scss'),
    ],
    vendor: [
      'babel-polyfill',
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'redux'
    ]
  },
  output: {
    path: outPath,
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
        use: ['babel-loader', 'awesome-typescript-loader?configFileName=tsconfig.json'],
      },
      // css
      {
        test: /\.css$/,
        use: 'css-loader',
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
          { 
            loader: 'file-loader',
            query: {
              name: 'assets/[hash].[ext]',
            }
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
      },/*
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
      },*/
      { test: /\.json$/, use: 'json-loader' }
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
  config.output.publicPath = publicPath;
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

config.stats =  "verbose"; /*{
  // Add asset Information
  assets: true,
  // Sort assets by a field
  assetsSort: "field",
  // Add information about cached (not built) modules
  cached: true,
  // Show cached assets (setting this to `false` only shows emitted files)
  cachedAssets: true,
  // Add children information
  children: true,
  // Add chunk information (setting this to `false` allows for a less verbose output)
  chunks: true,
  // Add built modules information to chunk information
  chunkModules: true,
  // Add the origins of chunks and chunk merging info
  chunkOrigins: true,
  // Sort the chunks by a field
  chunksSort: "field",
  // `webpack --colors` equivalent
  colors: true,
  // Display the distance from the entry point for each module
  depth: false,
  // Display the entry points with the corresponding bundles
  entrypoints: false,
  // Add errors
  errors: true,
  // Add details to errors (like resolving log)
  errorDetails: true,
  // // Exclude assets from being displayed in stats
  // // This can be done with a String, a RegExp, a Function getting the assets name
  // // and returning a boolean or an Array of the above.
  // excludeAssets: "filter" | /filter/ | (assetName) => ... return true|false |
  //   ["filter"] | [/filter/] | [(assetName) => ... return true|false],
  // // Exclude modules from being displayed in stats
  // // This can be done with a String, a RegExp, a Function getting the modules source
  // // and returning a boolean or an Array of the above.
  // excludeModules: "filter" | /filter/ | (moduleSource) => ... return true|false |
  //   ["filter"] | [/filter/] | [(moduleSource) => ... return true|false],
  // // See excludeModules
  // exclude: "filter" | /filter/ | (moduleSource) => ... return true|false |
  //   ["filter"] | [/filter/] | [(moduleSource) => ... return true|false],
  // Add the hash of the compilation
  hash: true,
  // Set the maximum number of modules to be shown
  maxModules: 15,
  // Add built modules information
  modules: true,
  // Sort the modules by a field
  modulesSort: "field",
  // Show dependencies and origin of warnings/errors (since webpack 2.5.0)
  moduleTrace: true,
  // Show performance hint when file size exceeds `performance.maxAssetSize`
  performance: true,
  // Show the exports of the modules
  providedExports: false,
  // Add public path information
  publicPath: true,
  // Add information about the reasons why modules are included
  reasons: true,
  // Add the source code of modules
  source: true,
  // Add timing information
  timings: true,
  // Show which exports of a module are used
  usedExports: false,
  // Add webpack version information
  version: true,
  // Add warnings
  warnings: true,
  // // Filter warnings to be shown (since webpack 2.4.0),
  // // can be a String, Regexp, a function getting the warning and returning a boolean
  // // or an Array of a combination of the above. First match wins.
  // warningsFilter: "filter" | /filter/ | ["filter", /filter/] | (warning) => ... return true|false
};*/

module.exports = config;