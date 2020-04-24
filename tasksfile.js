const { sh, cli } = require('tasksfile')

function clean() {
  sh("rimraf dist");
}

function build() {
  sh("tsc");
}

const dev = {
  build() {
    sh("webpack --mode development --watch", {async: true});
  },
  server() {
    //dev.build();
    sh("webpack-dev-server --mode development --watch");
  },
}

/*
    "clean": "rimraf dist",
    "build": "tsc",
    "watch:build": ,
    "watch:server": "nodemon './dist/main.js' --watch './dist'",
    "start": "npm-run-all clean build --parallel watch:build watch:server --print-label"

 */

cli({
  clean,
  dev
});