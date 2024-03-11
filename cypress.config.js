const { marge } = require('mochawesome');

module.exports = {
  e2e: {
    "baseUrl": "http://lojaebac.ebaconline.art.br/wp-json/wc/v3/"
  },

  // Configurando o reporter
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'mochawesome-report',
    overwrite: false,
    html: true,
    json: true
  },

};

