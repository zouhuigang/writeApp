<template>
  <div class="char-list">
    <div class="mdc-list-group" v-if="charList" v-for="(chars, charIndex) in charList">
      <h3 class="mdc-list-group__subheader">{{charIndex.toUpperCase()}} <span style="color: #777;">[{{chars[0]}}]</span></h3>
      <ul class="mdc-list">
        <li class="mdc-list-item" v-for="char in filter(chars)" v-on:click="charDetail(char)">
          {{ char }}
        </li>
      </ul>
      <!-- <hr class="mdc-list-divider"> -->
    </div>
  </div>
</template>

<script>
  import 'whatwg-fetch'
  export default {
    name: 'char-list',
    data () {
      return {
        charList: null,
      }
    },
    props: ['type'],
    created() {
      this.fetchData();
    },
    methods: {
      fetchData: function() {
        fetch('/api/pinyin', {
          method: "GET"
        }).then(function(response) {
          return response.json();
        }).then(data => {
          this.charList = data;
          // console.log(data)
        }).catch(function(e) {
          console.log("Oops, error");
        });
      },
      charDetail: function(name) {
        if(this.$props.type == 'import') {
          this.$emit('choose', name);
        }else {
          this.$router.push({name: "char",  params: { name: name }})
        }
      },
      filter: function (chars) {
        return chars.filter(function (char, index) {
          return index != 0;
        })
      }

    },
    // filters: {
    //   addPrefix: function(value) {
    //     return "first_letter_" + value;
    //   },
    //   addLinkPrefix: function(value) {
    //     return "#first_letter_" + value;
    //   }
    // },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1 {
    text-align: center;
  }
  h3 {
    background: #eee;
  }
  
  .char-list .mdc-list-group .mdc-list {
    display: flex;
    flex-wrap: wrap;
    border-left: 1px solid #eee;
    border-top: 1px solid #eee;
  }

  .char-list .mdc-list li {
    width: 25%;
    box-sizing: border-box;
    border-right: 1px solid #eee;
    border-bottom: 1px solid #eee;
    justify-content: center;
  }

  /*.mdc-list li+li {
    border-top: 1px solid #eee;
  }*/
</style>
