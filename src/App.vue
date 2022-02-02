<template>
  <MainPage/>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import MainPage from './components/MainPage.vue';

@Options({
  components: {
    MainPage,
  },
})
export default class App extends Vue {

}
</script>

<style lang="scss">
@import '~vue-toast-notification/dist/theme-default.css';

body {
  margin: 0;
  padding: 0;
  background-color: $bg-color;
  color: $text-main-color;
}

::selection {
  color: list.nth($grayscale, 1);
  background: $primary-color;
}

#app {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.v-toast__item--error {
  color: list.nth($grayscale, 1);
  background-color: $error-color;
}

.v-toast__item--warning {
  color: list.nth($grayscale, 1);
  background-color: $warning-color;
}

.v-toast__item--success {
  color: list.nth($grayscale, 1);
  background-color: $success-color;
}

.v-toast__item--default {
  color: list.nth($grayscale, 1);
  background-color: $primary-color;
}

.v-toast__text {
  font-family: 'Roboto', sans-serif;
}
</style>
