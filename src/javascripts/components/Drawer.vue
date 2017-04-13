<template>
  <div class="drawer">
    <i class="material-icons menu" v-on:click="open">
      menu
    </i>
    <aside class="mdc-temporary-drawer mdc-typography">
      <nav class="mdc-temporary-drawer__drawer">
        <header class="mdc-temporary-drawer__header">
          <!-- <div class="mdc-temporary-drawer__header-content">
            Header here
          </div> -->
        </header>
        <nav id="icon-with-text-demo" class="mdc-temporary-drawer__content mdc-list">
          <router-link
            class="mdc-list-item" 
            to="/"
          >
            <i class="material-icons mdc-list-item__start-detail" aria-hidden="true">home</i>主页
          </router-link>
          <router-link
            class="mdc-list-item"
            to="/charList"
          >
            <i class="material-icons mdc-list-item__start-detail" aria-hidden="true">list</i>模板字列表
          </router-link>
          <router-link
            class="mdc-list-item" 
            to="/write"
          >
            <i class="material-icons mdc-list-item__start-detail" aria-hidden="true">inbox</i>书写
          </router-link>
        </nav>
      </nav>
    </aside>
    
  </div>
</template>
<script>
  import {drawer as mdcDrawer} from 'material-components-web';
  const {MDCTemporaryDrawer, MDCTemporaryDrawerFoundation, util} = mdcDrawer;

  import {iconToggle} from 'material-components-web';
  const { MDCIconToggle } = iconToggle;


  export default {
    name: 'drawer',
    methods: {
      open: function() {
        let drawer = new MDCTemporaryDrawer(this.$el.querySelector('.mdc-temporary-drawer'));
        console.log('open')
        drawer.open = true
      },
      close: function() {
        let drawer = new MDCTemporaryDrawer(this.$el.querySelector('.mdc-temporary-drawer'));
        console.log('close')
        drawer.open = false
      },
    },
    mounted() {
      // MDCIconToggle.attachTo(document.querySelector('.mdc-icon-toggle'));
    }
  }
  
</script>
<style scoped>
  .mdc-temporary-drawer--selected {
    /*background: #ff0;*/
  }
  .menu {
    margin-top: 10px;
    margin-left: 10px;
  }
</style>