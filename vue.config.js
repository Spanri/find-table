module.exports = {
  assetsDir: "./",
  // publicPath: '/',
  publicPath: process.env.NODE_ENV === "production" ? "/find-table/" : "/",
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/assets/scss/_variables.scss";
          `
      },
      postcss: {
        // options here will be passed to postcss-loader
      }
    }
  }
};