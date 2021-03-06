module.exports = {
    head: {
        title: 'SimpleStory',
        meta: [{
            charset: 'utf-8',
        }, {
            name: 'viewport',
            content: 'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=yes,viewport-fit=cover',
        }, {
            'http-equiv': 'X-UA-Compatible', content: 'IE=edge',
        }, {
            hid: 'desc', name: 'description', content: 'Simple Story',
        }, {
            hid: 'ogtitle', name: 'og:title', content: 'Simple Story',
        }, {
            hid: 'ogdesc', name: 'og:description', content: 'Simple Story',
        }, {
            hid: 'ogtype', property: 'og:type', content: 'website',
        }, {
            hid: 'ogimage', property: 'og:image', content: '',
        }, {
            hid: 'ogurl', property: 'og:url', content: '',
        }],
        link: [{ rel: 'shortcut icon', href: '/simple.jpg' }],
    },
    modules: [
        '@nuxtjs/axios',
    ],
    buildModules: [
        '@nuxtjs/vuetify',
        '@nuxtjs/moment'
    ],
    build: {
      analyze: false,
        extend(config, { isClient, isServer, isDev }) {
          if (isServer && !isDev) {
              config.devtool = 'hidden-source-map';
          }
          console.log('webpack', config, isServer, isClient);
        }
    },
    vuetify: {},
    axios: {
        browserBaseURL: process.env.NODE_ENV === 'production' ? 'http://api.simplestory.ga' : 'http://localhost:3085',
        baseURL: process.env.NODE_ENV === 'production' ? 'http://api.simplestory.ga' : 'http://localhost:3085',
        https: false,
    },
    server: {
        port: process.env.PORT || 3085
    }
};