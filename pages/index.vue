<template lang="pug">
  section
    h1 Lessons learning.
    lessons(:lessons="lessons")
    //- nuxt-child.child
</template>
<script>
  import Lessons from '@/components/lessons'

  export default {
    components: { Lessons },
    async asyncData ({ app, req }) {
      return {
        lessons: await app.$content('/lessons').getAll()
      }
    }
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
