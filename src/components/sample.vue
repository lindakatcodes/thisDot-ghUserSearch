<template>
  <transition name="fade">
    <div class="wrapper">
      <img class="card" src="../../static/samples/startHere.svg">
      <img class="card" src="../../static/samples/ctrlZ.svg">
      <img class="card" src="../../static/samples/shipIt.svg">
    </div>
  </transition>
</template>

<script>
  export default {
    
  }
</script>

<style scoped>
  .wrapper {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 1fr;
    grid-gap: 10px;
    justify-items: center;
  }

  .card {
    height: 69vh;
  }
</style>