<template lang="pug">
  li.lesson
    svg.box(width="52px", height="52px", viewBox="0 0 52 52")
      polygon(ref="path", fill="white", :points="boxPoints")
    slot
</template>

<script>
import anime from 'animejs'
import bulgePoints from '@/assets/box/bulge'
import boxPoints from '@/assets/box/box'

const easing = 'easeOutBack'
const elasticity = 0
const duration = 300
const offset = 0
const baseOptions = { easing, duration, elasticity, offset }

export default {
  name: 'lesson',
  data: () => ({
    boxPoints,
    anime: null
  }),
  props: {
    lesson: {
      type: Object,
      required: true
    },
    index: Number
  },
  watch: {
    'lesson.active' (n, o) {
      if (n && !o) return this.activate()
      if (!n && o) return this.activate(true)
    },
    'lesson.inactive' (n, o) {
      if (n && !o) return this.inactivate()
      if (!n && o) return this.inactivate(true)
    }
  },
  methods: {
    async inactivate (reverse) {
      this.anime && this.anime.pause()
      this.anime = anime.timeline()

      this.anime
        .add(this.svgOptions(reverse, true))
        .add(this.wrapperOptions(reverse, true))
    },
    activate (reverse) {
      this.anime && this.anime.pause()
      this.anime = anime.timeline()

      this.anime
        .add(this.svgOptions(reverse))
        .add(this.wrapperOptions(reverse))
    },
    svgOptions (reverse = false, inactive = false) {
      const value = reverse || inactive ? boxPoints : bulgePoints
      return {
        ...baseOptions,
        targets: this.$refs.path,
        points: [ { value } ]
      }
    },
    wrapperOptions (reverse = false, inactive = false) {
      const scale = reverse ? 1 : inactive ? 0.925 : 1.1
      return {
        ...baseOptions,
        targets: this.$el,
        scale
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.lesson
  position: relative
  cursor: pointer
  transform: translate3d(0, 0, 0)

.box
  position: absolute
  height: 52px
  width: 52px
  left: -1px
  top: -1px
  z-index: -1
  cursor: pointer
</style>
