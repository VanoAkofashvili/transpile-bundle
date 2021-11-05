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
        return { path: args.path, namespace: 'a' };
      });
      // attempt to load a file
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log('onLoad', args);
        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: `
              import message from 'tiny-test-pkg';
              console.log(message);
            `,
          };
        }
      });
    },
  };
};
