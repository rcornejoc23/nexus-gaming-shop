
const path = require('path')

module.exports = function (config) {
    config.set({
        basePath: __dirname,

        frameworks: ['jasmine'],

        files: [
            'tests/**/*.spec.js'
        ],

        preprocessors: {
            'tests/**/*.spec.js': ['esbuild']
        },

        esbuild: {
            target: 'es2020',
            format: 'iife',
            absWorkingDir: __dirname,
            bundle: true,
            resolveExtensions: ['.jsx', '.js', '.json'],
            loader: {
                '.js': 'jsx',
                '.jsx': 'jsx'
            },
            jsx: 'automatic'
        },

        browsers: ['ChromeHeadless'],
        singleRun: true,
        reporters: ['progress'],

        client: {
            clearContext: false
        }
    })
}
