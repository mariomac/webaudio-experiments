const { sh, cli } = require('tasksfile')

function clean() {
  sh("rimraf dist");
}

function build() {
  sh("tsc");
}

function lint() {
  sh("tslint -c tslint.json 'src/**/*.ts'")
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
  lint,
  dev
});