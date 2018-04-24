const baseDomain = 'https://example.com'

module.exports = {
  modules: [
    '@nuxtjs/axios',
  ],
  axios: {
    baseURL: `${baseDomain}/wp-json/wp/v2`
  },
}
