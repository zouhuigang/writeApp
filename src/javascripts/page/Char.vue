<template>
	<div class="char">
		<div class="mdc-card">
     	<div class="mdc-card__horizontal-block">
       	<section class="mdc-card__primary">
	        <h1 class="mdc-card__title mdc-card__title--large">{{ $route.params.name }}</h1>
	        <h2 class="mdc-card__subtitle">模板字</h2>
	      </section>
       	<div class="board" id="data-board">
       	</div>
     </div>
     <section class="mdc-card__actions">
       <button class="mdc-button mdc-button--compact mdc-card__action">毛笔字</button>
       <button class="mdc-button mdc-button--compact mdc-card__action">动画</button>
     </section>
   </div>
		
	</div>
</template>

<script>
	import Character  from '../Character/character';
	export default {
		name: 'char',
		data() {
			return {
				dataChar: null
			}
		},
		watch: {
	    $route (to, from) {
	      this.dataChar = new Character('data-board', {
	      	isXML: true,
	      	xmlFileName: this.$route.params.name
	      });
	    }
	  },
		mounted() {
	  	this.dataChar = new Character('data-board', {
	  		isXML: true,
	  		xmlFileName: this.$route.params.name
	  	});
	  }
	}
</script>

<style>
	.char .mdc-card {
		width: 90%;
		margin: 20px auto;
	}

	.char #data-board > .Character-wrapper {
		width: 200px;
	}
	
</style>