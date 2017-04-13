<template>
	<div class="write">
  	<div class="example">
			<h1>写字板</h1>
			<div class="board" id="default-board"></div>
		</div>
	</div>
</template>

<script>
	import Character  from '../Character/character';

	export default {
	  name: 'write',
	  data () {
	    return {
	      msg: 'Welcome!这是Write页面',
	    }
	  },
	  mounted() {
	  	var defaultChar = new Character('default-board');
	  }
	}
</script>

<style scoped>
		#default-board > .Character-wrapper{
			width: 600px;
			height: 800px;
		}
		#data-board > .Character-wrapper {
			width: 450px;
			height: 600px;
		}
</style>