module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        sourceMap: true,
        sourceMapName: 'jquery.jgrowl.map'
      },
      jgrowl: {
        files: {
          'jquery.jgrowl.min.js': ['jquery.jgrowl.js']
        }
      }
    },
    less: {
      jgrowl: {
        files: {
          "jquery.jgrowl.css": "less/jgrowl.less"
        }
      }
    },
    cssmin: {
      jgrowl: {
        expand: true,
        src: 'jquery.jgrowl.css',
        ext: '.jgrowl.min.css'
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'jquery.jgrowl.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    watch: {
      scripts: {
        files: ['jquery.jgrowl.js', 'less/*'],
        tasks: ['jshint', 'less', 'cssmin', 'uglify'],
        options: {
          spawn: false
        }
      }
    },
    mochaTest: {
        test: {
            options: {
                reporter: 'spec',
                captureFile: 'results.txt', // Optionally capture the reporter output to a file
                quiet: false, // Optionally suppress output to standard out (defaults to false)
                clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to false)
                noFail: false // Optionally set to not fail on failed tests (will still fail on other errors)
            },
            src: ['test/**/*.js']
        }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('test', ['jshint', 'mochaTest']);
  grunt.registerTask('default', ['jshint', 'uglify', 'less', 'cssmin']);
};
