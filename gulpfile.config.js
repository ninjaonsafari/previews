'use strict';
var GulpConfig = (function () {
	function gulpConfig() {
		this.source = './src/';
		this.sourceApp = this.source + 'app/';

		this.tsOutputPath = this.source + '/js';
		this.allJavaScript = [this.source + '/js/**/*.js'];
		this.allTypeScript = this.sourceApp + '/**/*.ts';

		this.lessOutputPath = this.source + '/css';
		this.lessSourceFile = this.sourceApp + '/main.less';
		this.allCss = [this.source + '/css/**/*.css'];
		this.allLess = this.sourceApp + '/**/*.less';

		this.typings = './typings/';
		this.libraryTypeScriptDefinitions = './typings/globals/**/*.ts';
	}
	return gulpConfig;
})();
module.exports = GulpConfig;