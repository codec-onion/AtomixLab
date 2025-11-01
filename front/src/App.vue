<template>
  <Header />
  <main>
    <RouterView />
  </main>
  <Footer />
</template>

<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<style scoped>
main {
  flex: 1;
}
</style>
