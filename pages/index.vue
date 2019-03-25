<template>
  <section>
    <h1>Lessons learning.</h1>
    <lessons />
  </section>
</template>
<script>
  import Lessons from '@/components/lessons'
  import { mapState } from 'vuex'

  export default {
    components: { Lessons },
    head () {
      const bodyClass = this.$route.path === '/'
        ? this.hover && 'light'
        : 'green'
      return {
        bodyAttrs: { class: bodyClass }
      }
    },
    computed: mapState(['hover'])
  }
</script>
<style lang="sass">
@import '~assets/global'
section
  text-align: center
  width: 200px
  margin-left: 50vw
  transform: translateX(-100px)

.lessons
  margin: 0 auto

h1
  font-weight: 100
  margin-bottom: 40px

.child
  margin-top: 200px
</style>
