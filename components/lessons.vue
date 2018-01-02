<template lang="pug">
  .lessons
    ol
      lesson(
        v-for="(item, index) in items",
        v-bind="item",
        :key="item.key"
        @mouseover.native="activate(item.lesson, true)",
        @mouseout.native="activate(item.lesson, false)")
        span {{ item.content }}
      nuxt-link(to="/", v-if="displayBack"): appear(text="Back").back
    //- nuxt-child
</template>

<script>
import Lesson from '@/components/lesson'
import Appear from '@/components/title'

const BACK_DELAY = 1250

export default {
  name: 'lessons',
  data: () => ({
    active: {},
    displayBack: false
  }),
  components: { Lesson, Appear },
  props: {
    lessons: {
      type: Array,
      required: true
    }
  },
  mounted () {
    this.chosenHasChanged(this.chosen)
  },
  methods: {
    activate ({ permalink, ...rest } = {}, active) {
      if (!permalink) console.error(rest)
      this.$set(this.active, permalink, active)
    },
    chosenHasChanged (n, o) {
      if (n && !o) {
        this.lessons.forEach(l => this.activate(l, false))
        return setTimeout(() => { this.displayBack = true }, BACK_DELAY)
      }
      if (!n && o) {
        this.lessons.forEach(l => this.activate(l, false))
      }
      this.displayBack = !!n
    }
  },
  computed: {
    slug () { return this.$route.params.slug },
    chosen () { return this.slug && `/${this.slug}` },
    anyActive () { return Object.values(this.active).some(b => b) },
    items () {
      return this.lessons.map((lesson, index) => ({
        lesson: lesson,
        index: index,
        key: lesson.permalink,
        active: this.active[lesson.permalink],
        inactive: this.anyActive && !this.active[lesson.permalink],
        chosen: lesson.permalink === this.chosen,
        hidden: this.chosen && lesson.permalink !== this.chosen,
        content: lesson.about ? '?' : index + 1
      }))
    }
  },
  watch: {
    chosen (n, o) {
      this.chosenHasChanged(n, o)
    }
  }
}
</script>

<style lang="sass" scoped>
@import '~assets/global'

.lessons
  padding-left: 17px

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
