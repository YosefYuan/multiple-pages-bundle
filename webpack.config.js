const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');

// create entry and html config dynamically

const setMPA = () => {
    const entry = {};
    const htmlPlugins = [];

    // scan all the folder in 'src/pages'
    const pagePaths = glob.sync(path.join(__dirname, 'src', 'pages', '*', 'index.js'));

    pagePaths.forEach((filePath) => {
        console.log('filePaht', filePath);
        const pageName = filePath.match(/src\\pages\\(.*)\\index\.js/)[1]; // get file name
        entry[pageName] = filePath;
        htmlPlugins.push(
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, `src/pages/${pageName}/index.html`),
                filename: `${pageName}.html`,
                chunks: [pageName],
            })
        )
    });

    return { entry, htmlPlugins };
};

const { entry, htmlPlugins } = setMPA();
console.log('entry', entry);
console.log('htmlPlugins', htmlPlugins);

module.exports = {
    entry,
    output: {
        filename: `[name].[contenthash].js`,
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /.js$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /.css/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'images/[name].[hash].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        ...htmlPlugins,
    ],
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist'), // Directory to serve static files from
        },
        open: true,
        hot: true,
        port: 3000,
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 20000,
            maxSize: 70000,
            name: 'common',
        },
    },
}