<template lang="pug">
  .title(:class="{ go }")
    .wrapper(v-for="word in words", ref="words"): span {{ word }}
</template>

<script>
export default {
  name: 'title',
  props: {
    text: String
  },
  data: () => ({ go: false }),
  computed: {
    words () { return this.text.split(' ') }
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

.wrapper
  display: inline-block
  overflow: hidden

  &:not(:last-child)::after
    content: '\00a0'

  span
    display: inline-block
    animation: appear 0.4s both cubic-bezier(0.230, 1.000, 0.320, 1.000)

  @for $i from 1 through 10
    &.line-#{$i} span
      animation-delay: $i * .1s
</style>
