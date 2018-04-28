<template lang="pug">
  li.lesson(
    :class="{ active, inactive, about, hidden, chosen, moving, wait }"
    :style="style")
    svg.box(width="52px", height="52px", viewBox="0 0 52 52", ref="wrapper")
      polygon(ref="path", fill="white", :points="boxPoints")
    .expander
    nuxt-link(:to="lesson.permalink"): slot
    appear(:text="lesson.title", v-if="displayTitle")
    .footer
      nuxt-link(to="/", v-if="displayBack"): appear(text="Back").back
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
const aboutHeight = 430
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
    moving: false,
    wait: true,
    displayBack: false
  }),
  mounted () {
    this.wait = false
    if (this.hidden) this.hide()
    if (this.chosen) this.choose(false, { duration: 150 })
    if (this.about) return
    this.interval = setInterval(() => this.tryToWiggle(), 1500)
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
    },
    about () { return this.lesson.about }
  },
  props: {
    lesson: {
      type: Object,
      default: () => ({})
    },
    index: Number,
    active: Boolean,
    inactive: Boolean,
    hidden: Boolean,
    chosen: Boolean
  },
  watch: {
    active (n, o) {
      if (this.chosen || this.moving || this.hidden) return
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
      if (n && !o) return this.hide()
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

      return animes[this._uid].finished
    },
    activate (reverse, inactive, opts = {}) {
      this.animate('active', reverse, inactive, opts)
    },
    async choose (reverse) {
      reverse
        ? this.displayBack = false
        : setTimeout(() => { this.displayBack = true }, 1250)

      this.moving = true
      await this.animate('chosen', reverse, { delay: reverse ? 0 : duration * 0.65 })
      this.moving = false
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
      if (Math.random() < 0.9) return
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
      const args = {
        reverse: {
          width: [
            { value: 200, duration },
            { value: size, duration }
          ],
          height: size,
          translateX: [
            { value: -17, duration },
            { value: 0, duration }
          ],
          left: [
            { value: 0, duration },
            { value: this.style.left, duration }
          ],
          top: [
            { value: 0, duration },
            { value: this.style.top, duration }
          ]
        },
        default: {
          width: 200,
          height: [
            { value: size, duration },
            { value: this.about ? aboutHeight : 200, duration }
          ],
          translateX: -17,
          left: 0,
          top: 0
        }
      }
      const threshold = reverse ? 0 : 80
      return [
        { ...baseOptions, targets: this.$refs.path, points: boxPoints, offset: 0 },
        {
          ...baseOptions,
          ...args[reverse ? 'reverse' : 'default'],
          targets: this.$el,
          offset: 0,
          scale: 1,
          easing: 'easeInOutQuint',
          run: ({ progress }) => {
            if (progress > threshold) this.displayTitle = !reverse
          }
        }
      ]
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
@import '~assets/global'

.lesson
  position: absolute
  cursor: pointer

  &.chosen:not(.wait)
    svg
      opacity: 0

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
  font-size: 1.1em
  margin: 0
  color: $body

svg
  transition: .2s opacity ease
  transition-delay: .8s

  .chosen &
    transition-delay: 0s

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
  transition: .2s transform ease, .4s .9s opacity ease
  opacity: 0

  .chosen &
    opacity: 1
    transition-delay: 0s

  .lesson:not(.chosen):not(.moving):hover &
    transform: scale(0.9)

.about
  /deep/ span
    color: white !important

  .title
    padding-top: 0
    font-size: 1em

  .expander
    background-color: transparent
    border: 1px solid white

  polygon
    fill: transparent
    stroke: white
    stroke-alignment: inner
    stroke-linecap: round
    transform: scale(0.97)
    transform-origin: 50% 50%

  &:hover polygon
    animation: loop 1s linear infinite

  &:active polygon
    animation-direction: reverse
    animation-duration: 0.4s

.footer
  color: white
  position: absolute
  display: inline-block
  bottom: -40px
  left: 0
  right: 0

  .title
    font-size: 16px
    color: white

a:visited /deep/ span.content
  color: $body-faded
</style>
