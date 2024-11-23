import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url'; // Для поддержки ESM

// Эмуляция __dirname
// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Общая папка src
      '@assets': path.resolve(__dirname, './src/assets'), // Для ассетов
      '@components': path.resolve(__dirname, './src/components'), // Для компонентов
      '@pages': path.resolve(__dirname, './src/pages'), // Для страниц
      '@services': path.resolve(__dirname, './src/services'), // Для API-запросов
      '@store': path.resolve(__dirname, './src/store'), // Для Redux store
      '@styles': path.resolve(__dirname, './src/styles'), // Для LESS/CSS файлов
      '@utils': path.resolve(__dirname, './src/utils'), // Для вспомогательных функций
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  server: {
    open: true, // Автоматически открывать проект в браузере
  },
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, './index.html'), // Путь к index.html в корне проекта
    },
  },
});
