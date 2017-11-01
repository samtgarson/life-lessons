<template lang="pug">
  section
    h1 Sam's life lessons.
    lessons(:lessons="lessons")
</template>
<script>
  import Lessons from '@/components/lessons'

  export default {
    components: { Lessons },
    async asyncData ({ app }) {
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

.lessons
  margin: 0 auto

h1
  font-weight: 100
  margin-bottom: 40px

#about
  opacity: .5
  margin-top: 55px
  display: block
</style>
