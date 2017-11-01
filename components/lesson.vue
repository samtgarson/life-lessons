<template lang="pug">
  li.lesson(:class="{ next, clicked }", @mousedown="clicked = true", @mouseup="clicked=false")
    svg.box(width="52px", height="52px", viewBox="0 0 52 52")
      polygon(ref="path", fill="white", :points="boxPoints")
    slot
</template>

<script>
import Anime from 'animejs'
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

let animes = {}

export default {
  name: 'lesson',
  data: () => ({
    boxPoints,
    interval: null,
    clicked: false
  }),
  mounted () {
    if (this.next) return
    this.interval = setInterval(() =>
      this.tryToWiggle(),
    1500)
  },
  destroyed () {
    clearInterval(this.interval)
  },
  computed: {
  },
  props: {
    lesson: {
      type: Object,
      default: () => ({})
    },
    index: Number,
    active: Boolean,
    inactive: Boolean,
    next: Boolean
  },
  watch: {
    active (n, o) {
      if (n && !o) return this.activate()
      if (!n && o) return this.activate(true)
    },
    inactive (n, o) {
      if (n && !o) return this.inactivate()
      if (!n && o) return this.inactivate(true)
    },
    clicked (n, o) {
      if (n && !o) return this.activate(true, { duration: 1 })
      if (!n && o) return this.activate(false, { duration: 1 })
    }
  },
  methods: {
    async inactivate (reverse, opts = {}) {
      this.removeAnime()
      animes[this._uid] = Anime.timeline()

      animes[this._uid]
        .add({
          ...this.svgOptions(reverse, true),
          ...opts
        })
        .add({
          ...this.wrapperOptions(reverse, true),
          ...opts
        })
    },
    activate (reverse, opts = {}) {
      this.removeAnime()
      animes[this._uid] = Anime.timeline()

      animes[this._uid]
        .add({
          ...this.svgOptions(reverse),
          ...opts
        })
        .add({
          ...this.wrapperOptions(reverse),
          ...opts
        })
    },
    tryToWiggle () {
      if (this.active || this.inactive) return
      if (Math.random() < 0.92) return
      this.wiggle()
    },
    wiggle () {
      animes[this._uid] = Anime.timeline()
      wiggleAngles.forEach((a, i) =>
        animes[this._uid].add(this.wiggleOptions(i)))
    },
    wiggleOptions (i) {
      return {
        targets: this.$el,
        rotate: wiggleAngles[i],
        offset: 70 * i,
        easing: 'easeOutElastic',
        elasticity
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
    },
    removeAnime () {
      animes[this._uid] && animes[this._uid].pause()
    }
  }
}
</script>

<style lang="sass" scoped>
.lesson
  position: relative
  cursor: pointer
  transition: transform .05s ease-out

.box
  position: absolute
  height: 52px
  width: 52px
  left: -1px
  top: -1px
  z-index: -1
  cursor: pointer

@keyframes loop
  0%
    stroke-dashoffset: 0

  100%
    stroke-dashoffset: -8

.next
  color: white
  font-size: 24px

  polygon
    fill: transparent
    stroke: white
    stroke-alignment: inner
    stroke-dasharray: 3, 5
    stroke-linecap: round
    transform: scale(0.97)
    transform-origin: 50% 50%

  &:hover polygon
    animation: loop 1s linear infinite

  &:active polygon
    animation-direction: reverse
    animation-duration: 0.4s
</style>
