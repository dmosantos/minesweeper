module.exports = {
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }
        ],
        options: {
            modules: true,
            localIdentName: '[local]_[hash:base64:8]'
        }
    },
}