module.exports = function (grunt) {
    'use strict';
    require('load-grunt-tasks')(grunt, {
        pattern: ['grunt-*']
    });

    const sass = require('sass');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        config: {
            'cssSrcDir': 'src/assets/sass',
            'cssTargetDir': 'css',
            'jsSrcDir': 'src/assets/js',
            'jsTargetDir': 'js'
        },
        copy: {
            dev: {
                files: [{
                    dest: './stage/shloka/assets/font/',
                    src: '*',
                    cwd: 'src/assets/font/',
                    expand: true
                }]
            },
            stage: {
                files: [{
                    dest: './stage/shloka/assets/font/',
                    src: '*',
                    cwd: 'src/assets/font/',
                    expand: true
                },
                {
                    dest: './stage/shloka/assets/svg/',
                    src: '*',
                    cwd: 'src/assets/svg/',
                    expand: true
                },
                {
                    dest: './stage/shloka/assets/img/',
                    src: '**/*',
                    cwd: 'src/assets/img/',
                    expand: true
                },
                {
                    dest: './stage/shloka/',
                    src: ['**/*.hbs',
                        '!node_modules/**',
                        '!assets',
                        '!src/',
                        '!assets/**'],
                    cwd: 'src/',
                    expand: true
                },
                {
                    dest: './stage/shloka/',
                    src: ['**/*.json',
                        '!node_modules/**',
                        '!assets',
                        '!src/',
                        '!assets/**'],
                    cwd: 'src/',
                    expand: true
                },
                {
                    dest: './stage/shloka/',
                    src: ['./package.json',
                        '!node_modules/**',
                        '!assets',
                        '!src/',
                        '!assets/**'],
                    cwd: '',
                    expand: true
                }]
            },
            zip: {
                files: [{
                    cwd: './stage/shloka/assets',
                    src: '**/*',
                    dest: 'assets/',
                    expand: true
                }]
            }
        },
        clean: {
            dev: ['dev'],
            stage: ['stage'],
            build: ['build'],
            all: ['dev', 'stage', 'build']
        },
        sass: {
            options: {
                implementation: sass,
                sourceMap: true
            },
            dev: {
                options: {
                    includePaths: ['<%= config.cssSrcDir %>'],
                    sourceMaps: true
                },
                files: {
                    './stage/shloka/assets/<%=  config.cssTargetDir %>/style.css': '<%=  config.cssSrcDir %>/style.scss'
                }
            },
            stage: {
                options: {
                    outputStyle: 'compressed'
                },
                files: {
                    './stage/shloka/assets/<%=  config.cssTargetDir %>/style.css': '<%=  config.cssSrcDir %>/style.scss'
                }
            }
        },
        postcss: {
            options: {
                map: true,
                processors: [
                    require('autoprefixer-core')({ browsers: ['last 2 versions'] })
                ]
            },
            dev: {
                src: './stage/shloka/assets/<%=  config.cssTargetDir %>/*.css'
            },
            stage: {
                src: './stage/shloka/assets/<%=  config.cssTargetDir %>/*.css'
            }
        },
        uglify: {
            js: {
                files: {
                    './stage/shloka/assets/<%=  config.jsTargetDir %>/vendor.js': ['<%=  config.jsSrcDir %>/libs/jquery-*.js', '<%=  config.jsSrcDir %>/libs/wordcloud2.js'],
                    './stage/shloka/assets/<%=  config.jsTargetDir %>/script.js': ['<%=  config.jsSrcDir %>/**/*.js', '!<%=  config.jsSrcDir %>/libs/highlight.pack.js', '!<%=  config.jsSrcDir %>/bookshelf.js', '!<%=  config.jsSrcDir %>/about.js'],
                    './stage/shloka/assets/<%=  config.jsTargetDir %>/bookshelf.js': ['<%=  config.jsSrcDir %>/bookshelf.js'],
                    './stage/shloka/assets/<%=  config.jsTargetDir %>/about.js': ['<%=  config.jsSrcDir %>/about.js'],
                }
            }
        },
        watch: {
            css: {
                files: '<%=  config.cssSrcDir %>/**/*.scss',
                tasks: ['sass:dev', 'copy:dev', 'postcss:dev']
            }
        },
        zip: {
            build: {
                cwd: 'stage/',
                src: [
                    '**',
                    '!node_modules',
                    '!node_modules/**',
                    '!src',
                    '!src/**',
                    '!build',
                    '!build/**',
                    '!.git',
                    '!.gitignore',
                    '!Gruntfile.js',
                    '!package-lock.json',
                    '!README.md',
                    '!package.json',
                    '!LICENSE',
		    '!routes.yaml'
                ],
                dest: `./build/${require('./package.json').name}.zip`
            }
        }
    });

    grunt.registerTask('stage', [
        'clean:all',
        'sass:stage',
        'postcss:stage',
        'copy:stage',
        'uglify'
    ]);
    grunt.registerTask('default', [
        'sass:dev',
        'postcss:dev',
        'copy:dev',
        'uglify',
        'watch'
    ]);
    grunt.registerTask('build', [
        'stage',
        'zip'
    ]);
};
