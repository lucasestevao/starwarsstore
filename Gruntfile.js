module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			js: {
				files: [
					'frontend/assets/js/**/*.js',
					'Gruntfile.js'
				],
				tasks: ['js']
			},
			css: {
				files: [
					'frontend/assets/css/*.css'
				],
				tasks: ['cssmin']
			},
			html: {
				files: [
					'frontend/views/*.html'
				],
				tasks: ['htmlmin']
			}
		},
		concat: {
			js: {
				src: [
					'frontend/assets/js/jquery-2.1.4.min.js',
					'frontend/assets/js/foundation.min.js',
					'frontend/assets/js/angular.min.js',
					'node_modules/angular-route/angular-route.js',
					'frontend/assets/js/app.js',
					'frontend/assets/js/controllers/*.js'
				],
				dest: 'frontend/.temp/js/main.js'
			}
		},
		cssmin: {
			minify: {
				files: [{
					expand: true,
					cwd: 'frontend/assets/css',
					src: ['*.css', '!*.min.css'],
					dest: 'frontend/public/assets/css',
					ext: '.min.css'
				}]
			},
			concat: {
				files: {
					'frontend/public/assets/css/app.min.css': ['frontend/assets/css/*.css']
				}
			}
		},
		uglify: {
			options: {
				beautify: false,
				mangle: true
			},
			js: {
				files: {
					'frontend/public/assets/js/app.min.js': ['frontend/.temp/js/main.js']
				}
			}
		},
		jsbeautifier: {
			files: ['Gruntfile.js', 'frontend/assets/js/**/*.js', "!frontend/assets/js/**/*.min.js", 'frontend/assets/css/*.css', '!frontend/assets/css/*.min.css'],
			options: {
				js: {
					indentSize: 1,
					indentChar: '	'
				}
			}
		},
		htmlmin: {
			dist: {
				options: {
					removeComments: true,
					collapseWhitespace: true
				},
				files: [{
					expand: true,
					cwd: 'frontend/views',
					src: '**/*.html',
					dest: 'frontend/public/'
				}]
			}
		},
		imagemin: {
			static: {
				options: {
					optimizationLevel: 1
				},
				files: [{
					expand: true,
					cwd: 'frontend/assets/img/',
					src: ['**/*.{png,jpg,gif,svg}'],
					dest: 'frontend/public/assets/img/'
				}]
			}
		},
		clean: {
			options: {
				'force': true
			},
			build: ['frontend/public/*', 'frontend/.temp']
		},
		connect: {
			options: {
				port: 3000,
				hostname: 'localhost',
				livereload: false
			},
			proxies: [{
				context: '/api',
				host: 'localhost',
				port: 3002
			}],
			livereload: {
				options: {
					open: false,
					base: ['frontend/public'],
					middleware: function(connect, options) {
						var middlewares = [];

						if (!Array.isArray(options.base)) {
							options.base = [options.base];
						}

						// Setup the proxy
						middlewares.push(require('grunt-connect-proxy/lib/utils').proxyRequest);

						// Serve static files
						options.base.forEach(function(base) {
							middlewares.push(connect.static(base));
						});

						return middlewares;
					}
				}
			}
		},
	});

	grunt.loadNpmTasks('grunt-connect-proxy');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-jsbeautifier');

	grunt.registerTask('js', ['jsbeautifier', 'concat', 'uglify']);
	grunt.registerTask('proxy', ['configureProxies:server', 'connect:livereload']);
	grunt.registerTask('default', ['clean', 'htmlmin', 'js', 'cssmin', 'imagemin', 'proxy', 'watch']);
	grunt.registerTask('dev', ['proxy', 'watch']);
};
