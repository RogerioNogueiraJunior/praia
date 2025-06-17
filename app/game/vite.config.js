export default {
  server: {
    proxy: {
      '/api': 'http://localhost:8081'
    }
  }
}