'use strict';

module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-ngdocs');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    ngdocs: {
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
    concat: {
      dist: {
        src: ['src/**/*.js'],
        dest: 'dist/<%= pkg.namelower %>.js'
      }
    },
    uglify: {
      options: {
        mangle: false
      },
      dist: {
        files: {
          'dist/<%= pkg.namelower %>.min.js': ['dist/<%= pkg.namelower %>.js']
        }
      }
    },
    clean: ['docs', 'dist']
  });

  grunt.registerTask('build', [
  	'clean',
    'jshint',
    'ngdocs',
    'concat',
    'uglify'
  ]);
  grunt.registerTask('default', ['build']);

};