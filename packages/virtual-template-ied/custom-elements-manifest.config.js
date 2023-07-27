import { readmePlugin } from 'cem-plugin-readme';

export default {
  globs: ['src/*.ts'],
  exclude: ['test/*.ts'],
  litelement: true,
  plugins: [
    readmePlugin({
      header: 'head.md',
      footer: 'foot.md',
      //private: 'hidden',
    }),
  ],
};
