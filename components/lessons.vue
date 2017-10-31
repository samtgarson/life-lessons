<template lang="pug">
  ol.lessons
    lesson(
      v-for="(lesson, index) in decoratedLessons",
      :lesson="lesson",
      :key="lesson.permalink",
      @mouseover.native="active = lesson.permalink",
      @mouseout.native="active = false") {{ index + 1 }}
    li.next ?
</template>

<script>
import Lesson from '@/components/lesson'

export default {
  name: 'lessons',
  data: () => ({ active: null }),
  components: { Lesson },
  props: {
    lessons: {
      type: Array,
      required: true
    }
  },
  computed: {
    decoratedLessons () {
      return this.lessons.map(l => ({
        ...l,
        active: l.permalink === this.active,
        inactive: this.active && l.permalink !== this.active
      }))
    }
  }
}
</script>

<style lang="sass" scoped>
@import '~assets/global'

ol
  padding: 0
  display: flex
  flex-flow: row wrap
  width: 166px
  margin-bottom: -8px

li
  list-style-type: none
  width: 50px
  height: 50px
  color: $blue
  font-size: 32px
  line-height: 32px
  display: flex
  align-items: center
  justify-content: center
  cursor: pointer
  margin-bottom: 8px

  &:not(:nth-child(3n))
    margin-right: 8px

  &.next
    background-color: transparent
    color: white
    border: 1px dashed white
    box-sizing: border-box
    font-size: 24px
    line-height: 24px
</style>
