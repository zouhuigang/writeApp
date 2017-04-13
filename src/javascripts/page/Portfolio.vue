<template>
	<div class="portfolio">
		<drawer></drawer>
		<h1 class="mdc-typography--title">{{ title }}</h1>
		<div class="mdc-grid-list  mdc-grid-list--tile-aspect-1x1">
	    <ul class="mdc-grid-list__tiles mdc-layout-grid">
	      <li class="mdc-grid-tile mdc-layout-grid__cell mdc-layout-grid__cell--span-2">
	        <div class="mdc-grid-tile__primary">
	          <img class="mdc-grid-tile__primary-content" src="images/sample-1.jpg" />
	        </div>
	      </li>
	      <li class="mdc-grid-tile mdc-layout-grid__cell mdc-layout-grid__cell--span-2">
	        <div class="mdc-grid-tile__primary">
	          <img class="mdc-grid-tile__primary-content" src="images/sample-1.jpg" />
	        </div>
	      </li>
	      <li class="mdc-grid-tile mdc-layout-grid__cell mdc-layout-grid__cell--span-2">
	        <div class="mdc-grid-tile__primary">
	          <img class="mdc-grid-tile__primary-content" src="images/sample-1.jpg" />
	        </div>
	      </li>
	      <li class="mdc-grid-tile mdc-layout-grid__cell mdc-layout-grid__cell--span-2">
	      	<div class="mdc-grid-tile__primary">
	      		<button @click="addCard()" class="mdc-fab material-icons" aria-label="Add">
	            <span class="mdc-fab__icon">
	              add
	            </span>
	          </button>
	      	</div>
	      </li>
	    </ul>
	  </div>
		
	</div>
</template>

<script>
	import Drawer from '../components/Drawer'
	export default {
		name: 'portfolio',
		data() {
			return {
				title: '作品集'
			}
		},
		methods: {
			addCard: function() {
				this.$router.push({path: "card"})
			}
		},
		components: {
			Drawer
		}
	}
</script>

<style scoped>
	h1 {
		text-align: center;
	}
	.portfolio .mdc-fab {
		position: absolute;
    margin: auto;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
	}
</style>
