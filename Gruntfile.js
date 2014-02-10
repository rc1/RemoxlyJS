module.exports = function( grunt ) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON( 'package.json' ),
        // Documentation
        docco: {
            distr: {
                src: [ 'src/ui.js' ],
                options: {
                    output: 'docs/'
                }
            }
        },
        // Build the JS files
        concat: {
            options: {},
            distr: {
                src: [ 'src/remoxly.header.js', 'src/mixins.js', 'src/ui.js', 'src/utils.js', 'src/exports.js', 'src/remoxly.footer.js' ],
                dest: 'build/remoxly.js'
            }
        },
        // Build the LESS files
        less: { 
            distr: {
                options: {
                    cleancss: true
                },
                files: {
                    'build/remoxly.css': 'src/ui.less',
                    'examples/ui.only.css': 'examples/ui.only.less'
                }
            }
        },
        // Build the JADE files
        jade: {
            compile: {
                options: {
                    pretty: true
                },
                files: {
                    'examples/ui.only.html' :'examples/ui.only.jade'
                }
            }
        },
        // Watch
        watch: {
            scripts: {
                files: [ 'src/*', 'examples/*' ],
                tasks: [ 'develop' ],
                options: {
                  spawn: false,
                }
            }
        }
    });

    grunt.registerTask( 'develop', [ 'less', 'jade', 'concat' ] );
    grunt.registerTask( 'default', [ 'develop', 'docco' ] );

    grunt.loadNpmTasks( 'grunt-docco' );
    grunt.loadNpmTasks( 'grunt-contrib-concat' );
    grunt.loadNpmTasks( 'grunt-contrib-less' );
    grunt.loadNpmTasks( 'grunt-contrib-watch' );
    grunt.loadNpmTasks( 'grunt-contrib-jade' );

};