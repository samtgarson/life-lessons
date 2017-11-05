<template lang="pug">
  li.lesson(
    :class="{ next, hidden, chosen }",
    @mousedown="clicked = true",
    @mouseup="clicked=false",
    :style="style")
    svg.box(width="52px", height="52px", viewBox="0 0 52 52", ref="wrapper")
      polygon(ref="path", fill="white", :points="boxPoints")
    slot
</template>

<script>
import Anime from 'animejs'
import bulgePoints from '@/assets/box/bulge'
import boxPoints from '@/assets/box/box'
import widePoints from '@/assets/box/wide'
// import tallPoints from '@/assets/box/tall'

const easing = 'easeOutQuint'
const elasticity = 100
const duration = 400
const offset = 0
const baseOptions = { easing, duration, elasticity, offset }
const size = 50
const margin = 8

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
    style () {
      const left = `${(this.index % 3) * (size + margin)}px`
      const top = `${Math.floor(this.index / 3) * (size + margin)}px`
      const width = '50px'
      const height = '50px'
      return {
        left,
        top,
        width,
        height
      }
    }
  },
  props: {
    lesson: {
      type: Object,
      default: () => ({})
    },
    index: Number,
    active: Boolean,
    inactive: Boolean,
    next: Boolean,
    hidden: Boolean,
    chosen: Boolean
  },
  watch: {
    active (n, o) {
      if (this.chosen || this.hidden) return
      if (n && !o) return this.activate()
      if (!n && o) return this.activate(true)
    },
    inactive (n, o) {
      if (this.chosen || this.hidden) return
      if (n && !o) return this.activate(false, true)
      if (!n && o) return this.activate(true, true)
    },
    clicked (n, o) {
      if (this.chosen || this.hidden) return
      if (n && !o) return this.activate(true, false, { duration: 100 })
      if (!n && o) return this.activate(false, false, { duration: 100 })
    },
    chosen (n, o) {
      if (n && !o) return this.choose(false, { duration: 150 })
      if (!n && o) return this.choose(true)
    },
    hidden (n, o) {
      if (n && !o) return this.hide(false)
      if (!n && o) return this.hide(true)
    }
  },
  methods: {
    animate (animation, ...args) {
      const opts = args.pop()
      this.removeAnime()
      animes[this._uid] = Anime.timeline()

      this[`${animation}Options`](...args).forEach(o =>
        animes[this._uid].add({ ...o, ...opts }))
    },
    activate (reverse, inactive, opts = {}) {
      this.animate('active', reverse, inactive, opts)
    },
    choose (reverse) {
      this.animate('chosen', reverse, { delay: 200 })
    },
    hide (reverse) {
      this.animate('hidden', reverse)
    },
    wiggle () {
      this.animate('wiggle')
    },
    tryToWiggle () {
      if (this.active || this.inactive || this.hidden || this.chosen) return
      if (Math.random() < 0.92) return
      this.wiggle()
    },
    wiggleOptions (i) {
      return wiggleAngles.map((a, i) => ({
        targets: this.$el,
        rotate: a,
        offset: 70 * i,
        easing: 'easeOutElastic',
        elasticity
      }))
    },
    activeOptions (reverse = false, inactive = false) {
      const points = reverse || inactive ? boxPoints : bulgePoints
      const scale = reverse ? 1 : inactive ? 0.925 : 1.1
      return [
        { targets: this.$refs.path, points },
        { targets: this.$el, scale }
      ].map(o => ({ ...baseOptions, ...o }))
    },
    chosenOptions (reverse = false) {
      const width = reverse ? size : 200
      const viewBox = `0 0 ${width} 52`
      const points = reverse ? boxPoints : widePoints
      const translateX = reverse ? 0 : -17
      const left = reverse ? this.style.left : 0
      const top = reverse ? this.style.top : 0
      return [
        { targets: this.$refs.wrapper, width, offset: 0, viewBox },
        { targets: this.$el, width, offset: 0, left, top, translateX },
        { targets: this.$refs.path, points, offset: 0 }
      ].map(o => ({ ...baseOptions, ...o, easing: 'easeInOutQuint' }))
    },
    hiddenOptions (reverse = false) {
      const opacity = reverse ? 1 : 0
      return [
        { targets: this.$el, offset: 0, opacity }
      ].map(o => ({ ...baseOptions, ...o }))
    },
    removeAnime () {
      animes[this._uid] && animes[this._uid].pause()
    }
  }
}
</script>

<style lang="sass" scoped>
.lesson
  position: absolute
  cursor: pointer

  &.chosen
    transform: translateX(-20px)

  &.hidden
    pointer-events: none

.box
  position: absolute
  height: 52px
  // width: 52px
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
