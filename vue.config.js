module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  },
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].template = 'src/output-template.html'
        return args
      })
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `
          @use "sass:list";
          @import "~@/assets/styles/variables.scss"; 
          @import "~@/assets/styles/mixins.scss"; 
          @import "~@/assets/styles/transitions.scss";
          `
      }
    }
  },

}
