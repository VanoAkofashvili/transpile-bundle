import * as esbuild from 'esbuild-wasm';
import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { fetchPlugin } from './plugins/fetch-plugin';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';

const App = () => {
  const ref = useRef<any>();
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    });
  };
  //`

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    if (!ref.current) return;

    // only transpiling, no build (transform = transpile)

    // const result = await ref.current.transform(input, {
    //   loader: 'jsx',
    //   target: 'es2015',
    // });
    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    });

    // console.log(result);

    setCode(result.outputFiles[0].text);
    try {
      eval(result.outputFiles[0].text);
    } catch (err) {
      alert('vano');
    }
  };

  return (
    <div>
      <textarea
        onChange={(e) => setInput(e.target.value)}
        value={input}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>{code}</pre>
      <iframe src="/test.html" sandbox="allow-same-origin" title="title" />
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
