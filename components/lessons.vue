<template lang="pug">
  ol.lessons
    lesson(
      v-for="(lesson, index) in lessons",
      :lesson="lesson",
      :index="index",
      :key="lesson.permalink",
      :active="active[lesson.permalink]",
      :inactive="anyActive && !active[lesson.permalink]",
      :chosen="lesson.permalink === chosen",
      :hidden="chosen && lesson.permalink !== chosen",
      @mouseup.native="chosen = lesson.permalink",
      @mouseover.native="activate(lesson, true)",
      @mouseout.native="activate(lesson, false)")
      span {{ index + 1 }}
    lesson(
      :next="true",
      :active="nextActive",
      :index="lessons.length",
      :hidden="!!chosen",
      @mouseover.native="nextActive = true",
      @mouseout.native="nextActive = false")
      span ?
</template>

<script>
import Lesson from '@/components/lesson'

export default {
  name: 'lessons',
  data: () => ({
    active: {},
    nextActive: false,
    chosen: false
  }),
  components: { Lesson },
  props: {
    lessons: {
      type: Array,
      required: true
    }
  },
  methods: {
    activate ({ permalink }, active) {
      this.$set(this.active, permalink, active)
    }
  },
  computed: {
    anyActive () { return Object.values(this.active).some(b => b) }
  }
}
</script>

<style lang="sass" scoped>
@import '~assets/global'

ol
  padding: 0
  width: 166px
  margin-bottom: -8px
  position: relative

li
  list-style-type: none
  color: $blue
  cursor: pointer

  span
    width: 50px
    height: 50px
    display: flex
    justify-content: center
    align-items: center
    font-size: 32px
    line-height: 32px
</style>
