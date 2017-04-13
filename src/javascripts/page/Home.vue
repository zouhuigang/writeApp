<template>
  <div class="home">
    <drawer></drawer>
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
  import Drawer from '../components/Drawer'
  export default {
    name: 'home',
    data () {
      return {
        msg: 'Home'
      }
    },
    components: {
      Drawer
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }
</style>
