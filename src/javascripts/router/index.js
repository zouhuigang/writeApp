import Vue from 'vue'
import Router from 'vue-router'
import Home from '../page/Home'
import Write from '../page/Write'
import CharList from '../page/CharList'
import Char from '../page/Char'
import Portfolio from '../page/Portfolio'
import Card from '../page/Card'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Portfolio
    },
    {
      path: '/write',
      name: 'Write',
      component: Write
    },
    {
      path: '/charList',
      component: CharList
    },
    {
      path: '/char/:name',
      name: 'char',
      component: Char
    },
    {
      path: '/card',
      component: Card
    }
  ]
})