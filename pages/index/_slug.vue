<template lang="pug">
  nuxtent-body(:body="post.body")
</template>

<script>
export default {
  asyncData: async ({ app, route, payload }) => ({
    post: await app.$content('/lessons').get(route.path)
  })
}
</script>

<style>

</style>
