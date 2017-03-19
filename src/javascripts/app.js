// import './modules'
import Character  from './Character';
import Chars from './Chars';


var xmlFile = document.getElementById('xmlfile');
var defaultChar = new Character('default-board');
var dataChar = new Character('data-board', {isXML: true}, xmlFile);
var charsBoard = new Chars('chars-board');


//三个界面元素：add, add, clear, 涉及到两个对象的交互的。
var addDefaultChar = defaultChar.el.querySelector(".Character-control-navigation-add");
var addDataChar = dataChar.el.querySelector(".Character-control-navigation-add");
var clearCharBtn = charsBoard.el.querySelector(".control-edit-clear");
var updateDefaultChar = defaultChar.el.querySelector(".Character-control-navigation-update");
var updateDataChar = dataChar.el.querySelector(".Character-control-navigation-update");
console.log(updateDefaultChar);

// 以下功能都可以包装为模块的函数

// 两个添加汉字的操作
addDefaultChar.addEventListener("click", function(){
	if(!defaultChar.strokeArray.length) {
		alert("请绘制笔画");
	}else{
		// charsBoard.canvas.style.backgroundImage = "url("+this.opts.backgroundImage+")";
		// cahrsBoard.canvas.style.backgroundRepeat = "no-repeat"	;
		
		defaultChar.saveImg(defaultChar.radio);
		defaultChar.mode = "brush";
		charsBoard.addCharBox();
		charsBoard.addChar(
			defaultChar.strokeArray
			,defaultChar.img
			,defaultChar.opts
		);
		defaultChar.strokeArray.length = 0;
		defaultChar.initGrid();
		//执行操作放到后面，参数改变放到前面。
		charsBoard.charsBox[charsBoard.charNum].initialize();
	}
}, false);

addDataChar.addEventListener("click", function(){
	if(!dataChar.strokeArray.length){
		alert("请选择文字");
	}else {
		dataChar.saveImg(defaultChar.radio);
		dataChar.mode = "brush";
		charsBoard.addCharBox();
		charsBoard.addChar(
			dataChar.strokeArray
			,dataChar.img
			,dataChar.opts
		);
		dataChar.strokeArray.length = 0;
		dataChar.initGrid();
		charsBoard.charsBox[charsBoard.charNum].initialize();
	}
}, false);

updateDefaultChar.addEventListener("click", function(){
	defaultChar.saveImg(defaultChar.radio);
	defaultChar.mode = "brush";
	charsBoard.updateChar(
		defaultChar.strokeArray
		,defaultChar.img
		,defaultChar.opts
	);
	defaultChar.strokeArray.length = 0;
	defaultChar.initGrid();
	charsBoard.charsBox[charsBoard.charNum].initialize();


});

updateDataChar.addEventListener("click", function(){
	dataChar.saveImg(dataChar.radio);
	dataChar.mode = "brush";
	charsBoard.updateChar(
		dataChar.strokeArray
		,dataChar.img
		,dataChar.opts
	);
	dataChar.strokeArray.length = 0;
	dataChar.initGrid();
	charsBoard.charsBox[charsBoard.charNum].initialize();
});

charsBoard.canvas.addEventListener("dblclick", function(){
	console.log("2");
	var charsBox = charsBoard.charsBox;
	var charsArray = charsBoard.charArray;
	var strokeArray;
	var flag = 0;
	for(var i=0; i<charsBox.length; i++) {
		if(charsBox[i].flag === true && !flag) {
			strokeArray = charsArray[i].strokeArray;
			console.log(strokeArray);
			if(!charsArray[i].opts.isXML) {
				console.log(3);
				defaultChar.initGrid();
				defaultChar.strokeArray.length = 0;
				defaultChar.strokeArray = _.cloneDeep(strokeArray);
				defaultChar.drawAllPoints(defaultChar.canvas, defaultChar.strokeArray);
			}else{
				dataChar.initGrid();
				dataChar.strokeArray.length = 0;
				dataChar.strokeArray = _.cloneDeep(strokeArray);
				dataChar.drawAllPoints(dataChar.canvas, strokeArray);
			}
		}
	}
	if(!flag){
		console.log("no selected!");
	}
});
console.log(`app.js has loaded!`)



