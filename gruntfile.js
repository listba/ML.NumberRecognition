module.exports = function(grunt) {

  //Initializing the configuration object
    grunt.initConfig({

      // Task configuration
    less: {
      development: {
        options: {
          compress: true,  //minifying the result
        },
        files: {
          "./content/css/main.css":"./content/less/main.less"
        }
      }
    },
    coffee: {
      compile: {
        files: {
          //'./scripts/coffee/to/result.js': 'path/to/source.coffee', // 1:1 compile 
          './scripts/js/main.js': ['./scripts/coffee/*.coffee'] // compile and concat into single file 
        }
  }
    },
    watch: {
        less: {
          files: ['./content/less/*.less'],
          tasks: ['less'],
          options: {
            livereload: true
          }
        },
        coffee: {
          files: ['./scripts/coffee/*.coffee'],  
          tasks: ['coffee'],
          options: {
            livereload: true
          }
        }
      }
    });

  // Plugin loading
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-coffee');

  // Task definition
  grunt.registerTask('default', ['less','coffee','watch']);
};