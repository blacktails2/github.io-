'use strict';
// livereload用の初期設定
var
    path = require('path'),
    lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet,
    folderMount = function folderMount(connect, point) {
        return connect.static(path.resolve(point));
    };
 
module.exports = function(grunt) {
    var pkg, taskName;
    pkg = grunt.file.readJSON('package.json');
    grunt.initConfig({
        // SassとCompassをコンパイルします。
        compass: {
            dist: {
                options: {
                    config: 'config.rb'
                }
            }
        },
        watch: {
            // Sassファイルが更新されたら、cmqとcsscombのタスクを実行します。
            sass: {,
                files: ['sass/mainanimate.scss'],
                tasks: ['compass', 'cmq', 'csscomb'],
                options: {
                    //変更されたらブラウザを更新
                    livereload: true,
                    nospawn: true
                }
            }
        },
        // http://localhost:9001/で表示を確認することができます。
        connect: {
            livereload: {
                options: {
                    port: 9001,
                    middleware: function(connect, options) {
                        return [lrSnippet, folderMount(connect, '.')];
                    }
                }
            }
        },
        // バラバラに記述されたメディアクエリをまとめることができます。
        cmq:{
            options: {
                log: false
            },
            dev: {
                files: {
                    'css/': ['css/mainanimate.css']
                }
            }
        },
        // csscombでCSSプロパティを揃えます。
        csscomb:{
            dev:{
                expand: true,
                cwd: 'css/',
                src: ['*.css'],
                dest: 'css/'
            }
        }
    });
 
    // GruntFile.jsに記載されているパッケージを自動読み込み
    for(taskName in pkg.devDependencies) {
        if(taskName.substring(0, 6) == 'grunt-') {
            grunt.loadNpmTasks(taskName);
        }
    }
 
    grunt.registerTask('default', ['connect', 'watch:sass']);
 
    grunt.registerTask('eatwarnings', function() {
        grunt.warn = grunt.fail.warn = function(warning) {
            grunt.log.error(warning);
        };
    });
};
