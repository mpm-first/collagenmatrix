/**
 * `tasks/config/sass`
 *
 * ---------------------------------------------------------------
 *
 * Compile your SASS files into a CSS stylesheet.
 *
 *
 */
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.config.set('sass', {
    dev: {
      options: {},
      files: [{
        expand: true,
        cwd: 'assets/styles/',
        src: ['style.scss'],
        dest: '.tmp/public/styles/',
        ext: '.css'
      }]
    }
  });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // This Grunt plugin is part of the default asset pipeline in Sails,
  // so it's already been automatically loaded for you at this point.
  //
  // Of course, you can always remove this Grunt plugin altogether by
  // deleting this file.  But check this out: you can also use your
  // _own_ custom version of this Grunt plugin.
  //
  // Here's how:
  //
  // 1. Install it as a local dependency of your Sails app:
  //    ```
  //    $ npm install grunt-contrib-sass --save-dev --save-exact
  //    ```
  //
  //
  // 2. Then uncomment the following code:
  //
  // ```
  // // Load Grunt plugin from the node_modules/ folder.
  // grunt.loadNpmTasks('grunt-contrib-sass');
  // ```
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

};
