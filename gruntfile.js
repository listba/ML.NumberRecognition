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
          "./public/content/css/main.css":"./public/content/less/main.less"
        }
      }
    },
    coffee: {
      compile: {
        files: {
          //'./scripts/coffee/to/result.js': 'path/to/source.coffee', // 1:1 compile 
          './public/scripts/js/main.js': ['./public/scripts/coffee/*.coffee'], 
          './app.js': ['./app.coffee']
        }
  }
    },
    watch: {
        less: {
          files: ['./public/content/less/*.less'],
          tasks: ['less'],
          options: {
            livereload: true
          }
        },
        coffee: {
          files: ['./public/scripts/coffee/*.coffee','./app.coffee'],  
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