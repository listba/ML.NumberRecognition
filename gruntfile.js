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
          "./src/public/content/css/main.css":"./src/public/content/less/main.less"
        }
      }
    },
    coffee: {
      compile: {
        files: {
          //'./scripts/coffee/to/result.js': 'path/to/source.coffee', // 1:1 compile 
          './src/public/scripts/js/main.js': ['./src/public/scripts/coffee/*.coffee'], 
          '../src/app.js': ['./src/app.coffee']
        }
  }
    },
    watch: {
        less: {
          files: ['./src/public/content/less/*.less'],
          tasks: ['less'],
          options: {
            livereload: true
          }
        },
        coffee: {
          files: ['./src/public/scripts/coffee/*.coffee','./src/app.coffee'],  
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