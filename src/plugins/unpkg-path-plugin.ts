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
        }

        if (args.path.includes('./') || args.path.includes('../')) {
          return {
            namespace: 'a',
            path: new URL(
              args.path,
              'https://unpkg.com' + args.resolveDir + '/'
            ).href,
          };
        }

        return {
          namespace: 'a',
          path: `https://unpkg.com/${args.path}`,
        };
      });
      // attempt to load a file
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log('onLoad', args);
        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: `
              import react from "react"
              import reactDOM from "react-dom"
              // console.log(react, reactDOM);
            `,
          };
        }

        const { data, request } = await axios.get(args.path);
        console.log(request);
        return {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname,
        };
      });
    },
  };
};
