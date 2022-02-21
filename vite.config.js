import reactRefresh from '@vitejs/plugin-react-refresh'
import {defineConfig} from "vite";

/**
 * https://vitejs.dev/config/
 * @type { import('vite').UserConfig }
 */
export default defineConfig(({command}) => {
  if (command === 'local') {
    return {
      plugins: [reactRefresh()]
    }
  } else {
    return {
      plugins: [reactRefresh()],
      server: {
        host: '0.0.0.0',
        hmr: {
          port: 443,
        }
      }
    }
  }
})
