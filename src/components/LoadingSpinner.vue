<template>
  <div class="spinner"></div>
</template>

<script lang="ts" src="./LoadingSpinner.ts">
</script>

<style lang="scss" scoped>
.spinner {
  border: medium solid transparent;
  border-radius: 50%;
  border-top: medium solid $primary-color;
  border-bottom: medium solid $primary-color;
  border-left: medium solid $primary-color;
  width: 100%;
  height: 100%;
  -webkit-animation: spin 0.8s linear infinite; /* Safari */
  animation: spin 0.8s linear infinite;
  cursor: wait;
}


/*Safari */
@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
