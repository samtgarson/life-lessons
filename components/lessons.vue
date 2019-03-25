<template>
  <div class="lessons">
    <ol>
      <lesson
        v-for="(item, index) in items"
        v-bind="item"
        :key="item.key"
        @mouseover.native="activate(item.lesson, true)"
        @mouseout.native="activate(item.lesson, false)"
      >
        <span class="content">{{ item.content }}</span>
      </lesson>
    </ol>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import lessons from '@/assets/lessons'
import Lesson from '@/components/lesson'
import Appear from '@/components/appear'

export default {
  name: 'lessons',
  data: () => ({
    active: {}
  }),
  components: { Lesson, Appear },
  mounted () {
    this.chosenHasChanged(this.chosen)
  },
  methods: {
    ...mapMutations(['updateHover']),
    async activate ({ slug } = {}, active) {
      await this.$nextTick()
      this.$set(this.active, slug, active)
      this.updateHover(active)
    },
    chosenHasChanged (n, o) {
      lessons.forEach(l => this.activate(l, false))
    }
  },
  computed: {
    chosen () { return this.$route.params.slug },
    anyActive () { return Object.values(this.active).some(b => b) },
    items () {
      return lessons.map((lesson, index) => ({
        lesson: lesson,
        index: index,
        key: lesson.slug,
        active: this.active[lesson.slug],
        inactive: this.anyActive && !this.active[lesson.slug],
        chosen: lesson.slug === this.chosen,
        hidden: this.chosen && lesson.slug !== this.chosen,
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
  transform: scale(1.2)

ol
  padding: 0
  width: 166px
  margin-bottom: -8px
  position: relative

li
  list-style-type: none
  color: $blue
  cursor: pointer
  
  .green &:not(.about) span.content
    color: $body

  .light &:not(.about) span.content
    color: $light-blue !important
  
  span.content
    transition: .6s color ease-out
    width: 50px
    height: 50px
    display: flex
    justify-content: center
    align-items: center
    font-size: 32px
    line-height: 32px
</style>
