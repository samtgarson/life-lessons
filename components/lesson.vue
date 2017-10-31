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

const easing = 'easeInOutQuart'

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
    }
  },
  watch: {
    'lesson.active' (n, o) {
      if (n && !o) return this.activate()
      if (!n && o) return this.activate(true)
    }
  },
  methods: {
    activate (reverse) {
      this.anime && this.anime.pause()
      this.anime = anime.timeline({
        duration: 200
      })

      this.anime
        .add(this.svgOptions(reverse))
        .add(this.wrapperOptions(reverse))
    },
    svgOptions (reverse) {
      const value = reverse ? boxPoints : bulgePoints
      return {
        targets: this.$refs.path,
        points: [ { value } ],
        offset: 0,
        elasticity: 200,
        easing
      }
    },
    wrapperOptions (reverse) {
      const scale = reverse ? 1 : 1.1
      return {
        targets: this.$el,
        offset: 0,
        elasticity: 200,
        scale,
        easing
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
