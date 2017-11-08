<template lang="pug">
  li.lesson(
    :class="{ next, hidden, chosen, moving }",
    @mousedown="clicked = true",
    @mouseup="clicked=false",
    :style="style")
    svg.box(width="52px", height="52px", viewBox="0 0 52 52", ref="wrapper")
      polygon(ref="path", fill="white", :points="boxPoints")
    .expander(v-if="!next")
    slot
    appear(:text="lesson.title", v-if="displayTitle")
</template>

<script>
import Anime from 'animejs'
import Appear from '@/components/title'
import bulgePoints from '@/assets/box/bulge'
import boxPoints from '@/assets/box/box'

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
  components: { Appear },
  data: () => ({
    boxPoints,
    interval: null,
    clicked: false,
    displayTitle: false,
    moving: false
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
      if (this.chosen || this.moving) return
      if (n && !o) return this.activate()
      if (!n && o) return this.activate(true)
    },
    inactive (n, o) {
      if (this.chosen || this.moving) return
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
      console.log({ animation })
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
      this.animate('chosen', reverse, { delay: reverse ? 0 : duration * 0.65 })
    },
    hide (reverse) {
      this.animate('hidden', reverse, { delay: reverse ? duration * 1.75 : 0 })
    },
    wiggle () {
      this.animate('wiggle')
    },
    tryToWiggle () {
      if (this.active || this.inactive || this.hidden || this.chosen) return
      if (animes[this._uid] && animes[this._uid].progress < 100) return
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
      this.moving = true
      const width = reverse ? [
        { value: 200, duration },
        { value: size, duration }
      ] : 200
      const height = reverse ? size : [
        { value: size, duration },
        { value: 200, duration }
      ]
      const translateX = reverse ? [
        { value: -17, duration },
        { value: 0, duration }
      ] : -17
      const left = reverse ? [
        { value: 0, duration },
        { value: this.style.left, duration }
      ] : 0
      const top = reverse ? [
        { value: 0, duration },
        { value: this.style.top, duration }
      ] : 0
      const threshold = reverse ? 30 : 80
      return [
        { targets: this.$el, width, height, offset: 0, left, top, translateX }
      ].map(o => ({
        ...baseOptions,
        ...o,
        easing: 'easeInOutQuint',
        run: ({progress}) => { if (progress > threshold) this.displayTitle = !reverse },
        complete: () => { this.moving = false }
      }))
    },
    hiddenOptions (reverse = false) {
      this.moving = true
      const opacity = reverse ? 1 : 0
      return [
        { targets: this.$el, offset: 0, opacity }
      ].map(o => ({
        ...baseOptions,
        ...o,
        complete: () => { this.moving = false }
      }))
    },
    removeAnime () {
      if (!animes[this._uid] || animes[this._uid].progress === 100) return
      animes[this._uid].pause()
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
  left: -1px
  top: -1px
  z-index: -1
  cursor: pointer

.title
  text-align: left
  padding: 10px 17px 0
  font-size: 1.2em
  margin: 0

@keyframes loop
  0%
    stroke-dashoffset: 0

  100%
    stroke-dashoffset: -8

.expander
  position: absolute
  top: 0
  left: 0
  right: 0
  bottom: 0
  background-color: white
  border-radius: 4px
  z-index: -1
  transition: .2s transform ease

  .lesson:not(.chosen):not(.moving):hover &
    transform: scale(0.9)

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
