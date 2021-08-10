<template>
  <div id="app">
    <Dashboard/>
  </div>
</template>

<script>
import Vue from 'vue'
import { Box, Flex } from "vue-grid-styled";

Vue.component("v-box", Box);
Vue.component("v-flex", Flex);


Vue.use(Chartkick.use(Chart));

import Dashboard from './components/Dashboard'

export default {
  name: 'App',
  components: {
    Dashboard
  }
}

function customTooltip() {
  // some logic
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
