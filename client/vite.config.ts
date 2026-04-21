import { defineConfig } from 'vite'
import { fileURLToPath, URL} from 'node:url'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Permite que el servidor sea accesible desde la red local
    port: 5173, // Puerto en el que se ejecutará el servidor de desarrollo
    watch: {
      usePolling: true, // Habilita el uso de polling para detectar cambios en los archivos
    }
  },
  //agregamos este fragmento de código
  resolve: {
    alias: {
      '@' :fileURLToPath(new URL('./src', import.meta.url)) //Definimos el @ para que apunte a ./src
    }
  }
})
