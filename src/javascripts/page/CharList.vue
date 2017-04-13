<template>
  <div class="home">
    <drawer></drawer>
    <h1 class="mdc-typography--title mdc-typography--adjust-margin">{{ title }}</h1>
    <char-list></char-list>
  </div>
</template>

<script>
  import 'whatwg-fetch'
  import Drawer from '../components/Drawer'
  import CharList from '../components/CharList'
  export default {
    name: 'home',
    data () {
      return {
        title: '模板字列表',
      }
    },
    
    components: {
      Drawer,
      CharList
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1 {
    text-align: center;
  }

  /*.mdc-list li+li {
    border-top: 1px solid #eee;
  }*/
</style>
