/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const ReactRefreshTypeScript = require("react-refresh-typescript");

module.exports = (env) => {
	const mode = env && env.prod ? "production" : "development";
	const isDev = env && !env.prod;

	const htmlTemplate = "./src/index.html";
	const plugins = [new HtmlWebpackPlugin({ template: htmlTemplate })];

	if (isDev) {
		plugins.push(new ReactRefreshWebpackPlugin());
	}

	return {
		devtool: "inline-source-map",
		entry: {
			app: "./src/index.ts",
		},
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					use: [
						{
							loader: "ts-loader",
							options: {
								transpileOnly: true,
								getCustomTransformers: () => ({
									before: [isDev && ReactRefreshTypeScript()].filter(Boolean),
								}),
							},
						},
					],
					exclude: /node_modules/,
				},
			],
		},
		resolve: {
			extensions: [".tsx", ".ts", ".js"],
		},
		mode,
		output: {
			publicPath: "/",
			filename: "[name].[contenthash].js",
			clean: true,
		},
		plugins,
		devServer: {
			open: true,
			historyApiFallback: true,
			client: {
				overlay: false,
			},
		},
	};
};
