// CHECKME: Change 'docs' to 'dist' or other naming conventions depending the hosting service you're using

const currentTask = process.env.npm_lifecycle_event;
const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fse = require('fs-extra')

// Variables

// PostCSS Plugins
const postCSSPlugins = [
  require('postcss-import'),
	require('postcss-mixins'),
  require('postcss-simple-vars'),
  require('postcss-nested'),
  require('postcss-hexrgba'),
	require('autoprefixer')
];

// CSS Configs
let cssConfig = {
	test: /\.css$/i,
	use: ['css-loader?url=false', {
		loader: 'postcss-loader',
		options: {
			plugins: postCSSPlugins
		}
	}],
};

// For loading images to the production folder
class RunAfterComplie {
	apply(compiler) {
		compiler.hooks.done.tap('Copy images', function() {
			fse.copySync('./app/assets/images', './docs/assets/images')
		})
	}
}

// For loading multiple HTML pages to the production folder
let pages = fse.readdirSync('./app').filter(function(file) {
	return file.endsWith('.html');
}).map(function(page) {
	return new HtmlWebpackPlugin({
		filename: page,
		template: `./app/${page}`
	})
});

// Configuration used for both dev and build tasks
let config = {
	entry: './app/assets/scripts/App.js',
	plugins: pages,
	module: {
		rules: [
			cssConfig,
			{		// For making our JS files working in a wider range of (older) browsers
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-react', '@babel/preset-env']
					}
				}
			}
		]
	}
};

// =======================================================================

// Development
if (currentTask == 'dev') {
	cssConfig.use.unshift('style-loader');

	config.output = {
		filename: 'bundled.js',
		path: path.resolve(__dirname, 'app'),
	};

	config.devServer = {
		before: function (app, server) {
			server._watch('./app/**/*.html')
		},
		contentBase: path.join(__dirname, 'app'),
		hot: true,
		port: 3000,
		host: '0.0.0.0'
	};

	config.mode = 'development';
}

// Production
if (currentTask == 'build') {
	postCSSPlugins.push(require('cssnano'));
	cssConfig.use.unshift(MiniCssExtractPlugin.loader);

	config.output = {
		filename: '[name].[chunkhash].js',
		chunkFilename: '[name].[chunkhash].js',
		path: path.resolve(__dirname, 'docs'),
	};

	config.mode = 'production';

	config.optimization = {
		splitChunks: {chunks: 'all'}
	};

	config.plugins.push(
		new CleanWebpackPlugin(), 
		new MiniCssExtractPlugin({filename: 'styles.[chunkhash].css'}),
		new RunAfterComplie()
	);
}




module.exports = config;