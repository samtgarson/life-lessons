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
    appear(text="Back", v-if="displayBack", @click.native="chosen = false").back
</template>

<script>
import Lesson from '@/components/lesson'
import Appear from '@/components/title'

export default {
  name: 'lessons',
  data: () => ({
    active: {},
    nextActive: false,
    chosen: false,
    displayBack: false
  }),
  components: { Lesson, Appear },
  props: {
    lessons: {
      type: Array,
      required: true
    }
  },
  methods: {
    activate ({ permalink, ...rest }, active) {
      if (!permalink) console.log(rest)
      this.$set(this.active, permalink, active)
    }
  },
  computed: {
    anyActive () { return Object.values(this.active).some(b => b) }
  },
  watch: {
    chosen (n, o) {
      if (n && !o) return setTimeout(() => { this.displayBack = true }, 1250)
      if (!n && o) this.activate(this.lessons.find(l => l.permalink === o), false)
      this.displayBack = n
    }
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

.back
  position: absolute
  top: 210px
  color: white
</style>
