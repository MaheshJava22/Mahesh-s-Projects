import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/getcust': 'http://localhost:8426',
      '/PostCust': 'http://localhost:8426',
      '/delcust': 'http://localhost:8426',
      '/updatecust': 'http://localhost:8426',
      '/getstaff': 'http://localhost:8426',
      '/Poststaff': 'http://localhost:8426',
      '/updatestaff': 'http://localhost:8426',
      '/delstaff': 'http://localhost:8426',
      '/getadmin': 'http://localhost:8426',
      '/getAdmin': 'http://localhost:8426',
      '/Postadmin': 'http://localhost:8426',
      '/updateadmin': 'http://localhost:8426',
      '/deladmin': 'http://localhost:8426',
    },
  },
});
