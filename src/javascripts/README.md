# JavaScript Assets
我们使用了Babel和Webpack

使用`__tests__`目录做测试用例，

### Tasks and Files
```
gulpfile.js/tasks/browserSync
gulpfile.js/tasks/webpackProduction
gulpfile.js/lib/webpack-multi-config
```

##### `entries`
JS入口文件

##### `extractSharedJs`
创建一个`shared.js`文件，包含所有的模块，在大型网站上比较适用。如果是小网站开发，设置为即可。

