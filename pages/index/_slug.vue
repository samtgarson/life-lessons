<template lang="pug">
  nuxtent-body(:body="post.body").body
</template>

<script>
export default {
  asyncData: async ({ app, route, payload }) => ({
    post: await app.$content('/lessons').get(route.path)
  })
}
</script>

<style lang="sass" scoped>
.body
  text-align: left
  font-size: 15px
  line-height: 150%
</style>
