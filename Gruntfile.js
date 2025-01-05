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
      main: {
        files: {
          "jquery.jgrowl.css": "less/jgrowl.less"
        }
      },
      min: {
        options: {
          compress: true,
        },
        files: {
          "jquery.jgrowl.min.css": "less/jgrowl.less"
        }
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
        tasks: ['jshint', 'less', 'uglify'],
        options: {
          spawn: false
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('default', ['jshint', 'uglify', 'less']);
};
