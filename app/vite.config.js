import reactRefresh from '@vitejs/plugin-react-refresh';
import {defineConfig} from "vite";
import stdLibBrowser from 'node-stdlib-browser';
import inject from '@rollup/plugin-inject';

/**
 * https://vitejs.dev/config/
 * @type { import('vite').UserConfig }
 */
export default defineConfig(async ({mode}) => {
  let configServer = {};

  if (mode === 'replit') {
    configServer = {
      server: {
        host: '0.0.0.0',
        hmr: {
          port: 443,
        }
      }
    }
  }

  return {
    resolve: {
      alias: stdLibBrowser
    },
    optimizeDeps: {
      include: ['buffer', 'process']
    },
    plugins: [
      reactRefresh(),
      {
        ...inject({
          global: [
            require.resolve(
              'node-stdlib-browser/helpers/esbuild/shim'
            ),
            'global'
          ],
          process: [
            require.resolve(
              'node-stdlib-browser/helpers/esbuild/shim'
            ),
            'process'
          ],
          Buffer: [
            require.resolve(
              'node-stdlib-browser/helpers/esbuild/shim'
            ),
            'Buffer'
          ]
        }),
        enforce: 'post'
      }
    ],
    ...configServer
  }
})
