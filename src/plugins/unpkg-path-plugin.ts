import axios from 'axios';

import * as esbuild from 'esbuild-wasm';
export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    // setup function will be automatically called by esbuild with a single argument
    // this build argument represents the bundling process
    setup(build: esbuild.PluginBuild) {
      // process of figuring out where the file is stored is onResolve
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log('onResole', args);
        if (args.path === 'index.js') {
          return { path: args.path, namespace: 'a' };
        } else if (args.path === 'tiny-test-pkg') {
          return {
            path: 'https://unpkg.com/tiny-test-pkg@1.0.0/index.js',
            namespace: 'a',
          };
        }
      });
      // attempt to load a file
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log('onLoad', args);
        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: `
              const message = require('tiny-test-pkg');
              console.log(message);
            `,
          };
        }

        const { data } = await axios.get(args.path);
        return {
          loader: 'jsx',
          contents: data,
        };
      });
    },
  };
};
