import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Separamos las librerías pesadas en sus propios archivos (chunks)
          if (id.includes('node_modules')) {
            if (id.includes('@mui/icons-material')) {
              return 'vendor_mui_icons';
            }
            if (id.includes('@mui/x-data-grid')) {
              return 'vendor_mui_datagrid';
            }
            if (id.includes('@mui')) {
              return 'vendor_mui';
            }
            if (id.includes('exceljs') || id.includes('xlsx')) {
              return 'vendor_excel';
            }
            if (id.includes('recharts') || id.includes('@mui/x-charts')) {
              return 'vendor_charts';
            }
            if (id.includes('pdfjs-dist')) {
              return 'vendor_pdf';
            }
            // El resto de librerías en un chunk genérico de vendor
            return 'vendor';
          }
        },
      },
    },
    // Opcional: Aumentamos el límite de advertencia si es necesario, 
    // aunque con el chunking debería bajar de 500kb
    chunkSizeWarningLimit: 1000, 
  },
})