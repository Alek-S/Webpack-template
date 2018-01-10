/*

Webpack config file - Use as starting point

Bundles JS (react, es2015) into 
	-public/assets/js/main.js (my code)
	-public/assets/js/vendor.js (libraries)

Removes localization from moment.js to significantly reduce vendor.js size

Bundles css files into single minified /style.css under public/assets/css

*/

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {

	//entry point
	entry: './src/app.js',

	// compiled output js
	output: {
		filename: 'public/assets/js/[name].js',
		chunkFilename: 'public/assets/js/[name]-[chunkhash].js',
	},


	module: {

		loaders: [
			{
				test: /\.jsx?$/,
				// only process files in src folder
				include: /src/,
				loader: 'babel-loader',
				query: {
					// transformations
					presets: ['react', 'es2015']
				}
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: 'css-loader'
				})
			}
		],
	}, //end module


	plugins: [

		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		}),

		//remove localization from moment.js (significantly reduces vendor.js)
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

		//JS minification
		new webpack.optimize.UglifyJsPlugin({
			comments: false,
			compress: {
				unused: true,
				dead_code: true,
				drop_console: true,
				warnings: false
			}
		}),


		// break out vendor (react, react-dom, axios..) into own bundle
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: ({ resource }) => /node_modules/.test(resource),
		}),

		// Output CSS to a separate, CSS-only bundle instead of inline with JS
		new ExtractTextPlugin('public/assets/css/style.css')
		
	], //end plugin


	// devtool: 'eval-source-map'
};
