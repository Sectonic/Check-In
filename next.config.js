/** @type {import('next').NextConfig} */
const withImages = require('next-images');
const withMDX = require('@next/mdx')();

const nextConfig = withImages({
  reactStrictMode: false,
  webpack(config, options) {
    config.module.rules.push({
      test: /\.(mp3)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          publicPath: '/_next/static/sounds', // Public path to your audio files
          outputPath: 'static/sounds', // Output directory for audio files in your project
        },
      },
    });

    return config;
  },
  pageExtensions: ['js', 'mdx'],
});

module.exports = withMDX(nextConfig);