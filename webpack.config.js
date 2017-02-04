const HTMLWebpackPlugin = require('html-webpack-plugin')

const HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
	template: __dirname + '/src/preview.html',
	filename: 'preview.html',
	inject: 'body'
})

const webpack = require("webpack");
module.exports = {
  plugins: [
    new webpack.NewWatchingPlugin()
  ]
}


module.exports = {
	entry: __dirname + '/src/scripts/app.js',
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				loaders: [
					'file?hash=sha512&digest=hex&name=[hash].[ext]',
					'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
				]
			}
		]
	},
	output: {
		filename: 'app_build.js',
		path: __dirname + '/build/',
		publicPath: ''
	},
	plugins: [
		HTMLWebpackPluginConfig
	]

}

