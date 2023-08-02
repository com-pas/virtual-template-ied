import { readmePlugin } from 'cem-plugin-readme';

export default {
  globs: ['src/virtual-template-ied.ts'],
  exclude: ['test/*.ts'],
  litelement: true,
  plugins: [
    readmePlugin({
      header: 'head.md',
      footer: 'foot.md',
      private: 'hidden',
    }),
  ],
};
