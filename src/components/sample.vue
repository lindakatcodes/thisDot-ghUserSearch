<template>
  <transition name="fade">
    <div class="wrapper">
      <img class="card" src="../../static/samples/startHere.svg" alt="Placeholder image for future results. A white rectangle with 3 gray rectangular boxes to simulate where text will go, with a centered photo of a cat at the top to simulate the user photo. The cat is brown with a little strawberry behind it's ear and is writing 'start here' on a piece of paper.">
      <img class="card" src="../../static/samples/ctrlZ.svg" alt="Placeholder image for future results. A white rectangle with 3 gray rectangular boxes to simulate where text will go, with a centered photo of a cat at the top to simulate the user photo. The cat is gray and sleeping, with the text 'ctrl+zzz' above it's head next to a moon.">
      <img class="card" src="../../static/samples/shipIt.svg" alt="Placeholder image for future results. A white rectangle with 3 gray rectangular boxes to simulate where text will go, with a centered photo of a cat at the top to simulate the user photo. The cat is gray and driving a blue boat, with a speech bubble saying 'ship it' above his head.">
    </div>
  </transition>
</template>

<script>
  export default {}
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

  @media screen and (max-width: 1280px) {
    .wrapper {
      grid-template-columns: 1fr;
    }
  }
</style>