# angular-loading-counter

Displays a visual feedback for background operations like API calls or long lasting tasks

## Documentation

Available on [gh-pages](http://destegabry.github.io/angular-loading-counter/ "API documentation")

## Dependencies
- required:
	AngularJS >= 1.2.0
- optional (building purpose):
	NodeJS
	Bower
	Grunt
	NGDoc	

See `bower.json` and `package.json` for more details

## Install

#### 1. download the files

run `bower install angular-loading-counter --save`

#### 2. include the files in your app

Manually:
```
 <script src="bower_components/dist/angular-loading-counter/angular-loading-counter.min.js"></script>
```

Or throught Grunt wiredep

#### 3. include the module `dsg.loadingCounter` in your application 

```
var app = angular.module('yourAngularApp', ['dsg.loadingCounter'])
```

#### 4. configure the module
```
app.config(['$httpProvider', 'LoadingCounterProvider', function ($httpProvider, LoadingCounterProvider) {
	// Configure an exclusion
	LoadingCounterProvider.addExclusion(/^\/api\/utils\/country, /get/i);
	// Push LoadingCounter in the http interceptors
	$httpProvider.interceptors.push('LoadingCounter');
}]);
```
See the [documentation](http://destegabry.github.io/angular-loading-counter/ "API documentation") for more details

## Development

1. `checkout`
	1. run `npm install && bower install`
	2. write your code then run `grunt`
	3. `commit` your changes
2. copy over core files to master branch
	1. `git checkout master`
	2. `git checkout src dist docs`
3. update README, CHANGELOG, bower.json, and do any other final polishing to prepare for publishing
	1. git commit changes
	2. git tag with the version number, i.e. `git tag v1.0.0`
4. create github repo and push
	1. [if remote does not already exist or is incorrect] `git remote add origin [github url]`
	2. `git push origin master --tags` (want to push master branch first so it is the default on github)
	3. `git checkout gh-pages`
	4. `git push origin gh-pages`
5. (optional) register bower component
	1. `bower register angular-loading-counter [git repo url]`


## To Do
1. Fix ngdoc to generate function reference

2. Add the possibility to display the `loadingCounter` directive based on a black/white list of tasks, to have different `<loading-counters>` on the page