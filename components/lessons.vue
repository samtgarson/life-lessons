<template lang="pug">
  ol.lessons
    lesson(
      v-for="(lesson, index) in lessons",
      :lesson="lesson",
      :index="index",
      :key="lesson.permalink",
      :active="active[lesson.permalink]",
      :inactive="anyActive && !active[lesson.permalink]",
      @mouseover.native="activate(lesson, true)",
      @mouseout.native="activate(lesson, false)") {{ index + 1 }}
    lesson.next(
      :active="nextActive",
      @mouseover.native="nextActive = true",
      @mouseout.native="nextActive = false") ?
</template>

<script>
import Lesson from '@/components/lesson'

export default {
  name: 'lessons',
  data: () => ({
    active: {},
    nextActive: false
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
</style>
