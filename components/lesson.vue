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

const easing = 'easeOutQuint'
const elasticity = 0
const duration = 300
const offset = 0
const baseOptions = { easing, duration, elasticity, offset }

const left = '-15deg'
const right = '15deg'
const wiggleAngles = [left, right, left, right, left, right, 0]

export default {
  name: 'lesson',
  data: () => ({
    boxPoints,
    anime: null,
    interval: null
  }),
  mounted () {
    this.anime = anime({ duration: 1 })
    this.interval = setInterval(() =>
      this.wiggle(),
    1500)
  },
  destroyed () {
    clearInterval(this.interval)
  },
  props: {
    lesson: {
      type: Object,
      default: () => ({})
    },
    index: Number,
    active: Boolean,
    inactive: Boolean
  },
  watch: {
    active (n, o) {
      if (n && !o) return this.activate()
      if (!n && o) return this.activate(true)
    },
    inactive (n, o) {
      if (n && !o) return this.inactivate()
      if (!n && o) return this.inactivate(true)
    }
  },
  methods: {
    async inactivate (reverse) {
      this.anime.pause()
      this.anime = anime.timeline()

      this.anime
        .add(this.svgOptions(reverse, true))
        .add(this.wrapperOptions(reverse, true))
    },
    activate (reverse) {
      this.anime.pause()
      this.anime = anime.timeline()

      this.anime
        .add(this.svgOptions(reverse))
        .add(this.wrapperOptions(reverse))
    },
    wiggle () {
      if (this.anime.progress < 100) return
      if (Math.random() < 0.95) return

      this.anime = anime.timeline()
      wiggleAngles.forEach((a, i) =>
        this.anime.add(this.wiggleOptions(i)))
    },
    wiggleOptions (i) {
      return {
        targets: this.$el,
        rotate: wiggleAngles[i],
        offset: 70 * i,
        easing: 'easeOutElastic'
      }
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

.next
  color: white
  font-size: 24px
  polygon
    fill: transparent
    stroke: white
    stroke-alignment: inner
    stroke-dasharray: 4, 4
    stroke-linecap: round
    transform: scale(0.97)
    transform-origin: 50% 50%
</style>
