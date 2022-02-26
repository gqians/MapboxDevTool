const path = require('path');

module.exports = {
	mode: 'development',
	entry: './src/index.js',
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, 'dist'),
		libraryTarget: 'umd',
		umdNamedDefine: true,
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			},
			{
				test: /\.css$/i,
				use: [
					'style-loader',
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [
									[
										'postcss-preset-env',
										{
											// 其他选项
										},
									],
								],
							},
						},
					},
				],
			},
		],
	},
};
