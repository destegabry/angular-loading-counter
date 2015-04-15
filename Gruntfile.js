'use strict';

module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-ngdocs');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    ngdocs: {
      options: {
        dest: '.'
      },
      api: {
        src: ['src/*.js', 'resources/docs/index.ngdoc'],
        title: 'angular-loading-counter'
      }
    },
    connect: {
      options: {
        keepalive: true
      },
      server: {}
    },
    jshint: {
    	options: {
    		jshintrc: true
    	},
      beforeconcat: ['./src/**/*.js']
    },
    clean: ['css', 'font', 'js', 'partials', 'index.html']
  });

  grunt.registerTask('website', [
  	'clean',
    'jshint',
    'ngdocs'
  ]);
  grunt.registerTask('default', ['website']);

};