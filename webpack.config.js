module.exports = {
    entry: './src/index.js',
    module: {
        rules: [
          {
            test: /\.(js)$/,
            exclude: /node_modules/,
            use: ['babel-loader']
          }
        ]
    },
    resolve: {
        extensions: ['*', '.js']
  },
    output: {
        filename: 'bundle.js',
        path: '/'
    },
    devServer: {
        contentBase: './dist'
    }
};
