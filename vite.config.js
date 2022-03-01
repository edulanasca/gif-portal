import reactRefresh from '@vitejs/plugin-react-refresh'
import {defineConfig} from "vite";

/**
 * https://vitejs.dev/config/
 * @type { import('vite').UserConfig }
 */
export default defineConfig(({mode}) => {
  let configServer;

  if (mode === 'localhost') {
    configServer = {
      plugins: [reactRefresh()],
      server: {
        host: '0.0.0.0'
      }
    }
  } else {
    configServer = {
      plugins: [reactRefresh()],
      server: {
        host: '0.0.0.0',
        hmr: {
          port: 443,
        }
      }
    }
  }

  return {
    define: {
      global: {},
      process: {
        'env': {}
      }
    },
    ...configServer
  }
})
