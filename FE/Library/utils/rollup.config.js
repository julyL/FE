import babel from 'rollup-plugin-babel';

export default {
  entry: './index.js',
  dest: './dest/utils.js',
  plugins: [
    babel({
      exclude: 'node_modules/**',
      presets: ['es2015-rollup']
    })
  ],
  format: 'umd',
  moduleName: 'utils'
};
