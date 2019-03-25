<template>
  <transition name="fade">
    <div class="appear" :class="{ go }">
      <div class="paragraph" v-for="paragraph in paragraphs">
        <div class="wrapper" v-for="word in paragraph" ref="words">
          <span v-html="word" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
const LINK_REGEX = /\[(.+?)\]\((.+?)\)/g
const LINK_REPLACE = '<a target="_blank" href="$2">$1</a>'
export default {
  name: 'appear',
  props: {
    text: {
      type: String,
      default: ''
    }
  },
  data: () => ({ go: false }),
  computed: {
    paragraphs () {
      if (!this.text.length) return []

      const splitLine = t => t
        .split(' ')
        .map(t => t.replace(LINK_REGEX, LINK_REPLACE))

      return this.text
        .split('\\n')
        .map(splitLine)
    }
  },
  async mounted () {
    await this.$nextTick()
    const offsets = this.$refs.words.reduce((arr, { offsetTop }) => {
      return (arr.indexOf(offsetTop) === -1) ? [...arr, offsetTop] : arr
    }, [])
    this.$refs.words.forEach(el => el.classList.add(`line-${offsets.indexOf(el.offsetTop)}`))
    this.go = true
  }
}
</script>

<style lang="sass" scoped>
@keyframes appear
  0%
    transform: translateY(100%)

  100%
    transform: none

@keyframes disappear
  0%
    transform: none

  100%
    transform: translateY(-100%)
    opacity: 0

.fade-leave-active
  transition: opacity 0.2s

.fade-leave-to
  .wrapper span
    animation: disappear 0.2s both cubic-bezier(0.230, 1.000, 0.320, 1.000)
    animation-delay: 0s !important

.paragraph + .paragraph
  margin-top: 10px

.wrapper
  display: inline-block
  overflow: hidden

  &:not(:last-child)::after
    content: '\00a0'

  span
    display: inline-block
    animation: appear 0.4s both cubic-bezier(0.230, 1.000, 0.320, 1.000)

  @for $i from 1 through 20
    &.line-#{$i} span
      animation-delay: $i * .1s

  /deep/ a
    text-decoration: underline
</style>
