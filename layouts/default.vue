<template>
    <div class="main_view">
      <slot/>
    </div>
</template>


<style scoped>
body {
    background-color: black;
}
.main_view {
    border-radius: 20px;
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
  background-color: rgba(255,250,166,255);
  padding: 20px;
}

</style>