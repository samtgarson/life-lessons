<template lang="pug">
  section
    ul
      li(v-for="caseStudy in caseStudies")
        nuxt-link(:to="caseStudy.path") {{ caseStudy.title }}
</template>
<script>
  export default {
    async asyncData ({ app }) {
      return {
        caseStudies: await app.$content('/case-studies').getAll()
      }
    }
  }
</script>
<style>
</style>
