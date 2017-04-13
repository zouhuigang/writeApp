<template>
	<div id="card">
		<h1 class="mdc-typography--title">{{ title }}</h1>
		<div id="chars-board" @click="startWrite">
		</div>

		<transition name="slide-fade">
			<div v-if="show"  class="overlay">
				<i class="material-icons overlay-check" v-on:click="saveWrite" aria-label="Check">
					check
				</i>
				<i class="material-icons overlay-close" v-on:click="cancelWrite" aria-label="Clear">
					clear
				</i>
		  	<div class="example">
					<h1>写字板</h1>
					<div class="board" id="default-board"></div>
				</div>
				<section>
					<div class="mdc-form-field" @click="setMode('write')">
	          <div class="mdc-radio" data-demo-no-js>
	            <input class="mdc-radio__native-control" type="radio" id="ex1-radio1" checked name="ex1">
	            <div class="mdc-radio__background">
	              <div class="mdc-radio__outer-circle"></div>
	              <div class="mdc-radio__inner-circle"></div>
	            </div>
	          </div>
	          <label id="ex1-radio1-label" for="ex1-radio1">手写字</label>
	        </div>
	        <div class="mdc-form-field" @click="setMode('select')">
	          <div class="mdc-radio" data-demo-no-js>
	            <input class="mdc-radio__native-control" type="radio" id="ex1-radio2" name="ex1">
	            <div class="mdc-radio__background">
	              <div class="mdc-radio__outer-circle"></div>
	              <div class="mdc-radio__inner-circle"></div>
	            </div>
	          </div>
	          <label id="ex1-radio2-label" for="ex1-radio2">模板字</label>
	        </div>
				</section>
				<button @click="importChar" class="mdc-button mdc-button--raised mdc-button--primary">
				  从模板字中引入
				</button>
			</div>
		</transition>
		<transition name="list-fade">
			<div v-if="listShow"  class="char-list overlay">
				<div class="header">
					<button @click="cancelImport" class="mdc-button mdc-button--dense">
					  取消
					</button>
				</div>
		  	<char-list type="import" v-on:choose="getFileName"></char-list>
			</div>
		</transition>
	</div>
</template>

<script>
	import Character  from '../Character/character'
	import CharList from '../components/CharList'
	import Chars from '../Chars'
	export default {
		name: 'card',
		data() {
			return {
				title: '创建作品',
				mode: 'write',
				char: null,
				charsBoard: null,
				show: false,
				listShow: false,
				pointer: -1,
				xml: false,
				xmlFileName: ""
			}
		},
		mounted() {
			this.charsBoard = new Chars('chars-board');
		},
		updated() {
			// TODO
			this.char = new Character('default-board', {
				isXML: this.xml,
      	xmlFileName: this.xmlFileName
			})
		},
		methods: {
			startWrite: function() {
				this.pointer = this.charsBoard.charPointer;
				if(this.pointer >= 0) {
					this.show = !this.show
					console.log(this.pointer);
				}
				
			},
			saveWrite: function() {
				this.show = !this.show;
				this.char.saveImg();
				this.charsBoard.addChar(
					this.char.curvesArray,
					this.char.img,
					this.char.opts
				);
				console.log(this.charsBoard);
				this.charsBoard.draw();
				this.charsBoard.charPointer = -1;

			},
			cancelWrite: function() {
				this.show = !this.show;
				this.charsBoard.draw();
				this.charsBoard.charPointer = -1;
			},
			importChar: function() {
				this.listShow = !this.listShow;
			},
			cancelImport: function() {
				this.listShow = !this.listShow;
			},
			getFileName: function(fileName) {
				this.listShow = !this.listShow;
				this.xml = true;
				this.xmlFileName = fileName;
			},
			setMode: function(mode) {
				this.mode = mode;
				if(mode == 'write') {
					this.xml = false;
				}
			}
		},
		components: {
			CharList
		}
	}
</script>

<style>
	#card h1 {
		text-align: center;
	}
	#card .chars-board > .chars-wrapper{
		width: 100%;
	}
	
	#card .header {
		padding: 20px 10px;
	}

	#card .overlay {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background: rgba(255,255,255,0.95);
	}
	
	#card .overlay.char-list {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background: rgba(255,255,255,0.95);
		overflow: scroll;
	}

	#card .overlay .overlay-check {
		position: absolute;
		right: 20px;
		top: 20px;
	}

	#card .overlay .overlay-close {
		position: absolute;
		left: 20px;
		top: 20px;
		overflow: hidden;
		z-index: 100;
	}

	#card .slide-fade-enter-active {
		transition: all .3s ease;
	}

	#card .slide-fade-leave-active {
		transition: all .3s ease;
	}

	#card .slide-fade-enter, .slide-fade-leave-active {
		-webkit-transform: translateY(100%);
		transform: translateY(100%);
		/*opacity: 0;*/
	}


	#card .list-fade-enter-active {
		transition: all .3s ease;
	}

	#card .list-fade-leave-active {
		transition: all .3s ease;
	}

	#card .list-fade-enter, .slide-fade-leave-active {
		-webkit-transform: translateY(100%);
		transform: translateY(100%);
		/*opacity: 0;*/
	}

	#card #default-board > .Character-wrapper{
			width: 100%;
		}

</style>
