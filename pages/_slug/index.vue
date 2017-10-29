<template lang="pug">
section
  h1 {{ post.title }}
  nuxtent-body(:body="post.body")

</template>

<script>
export default {
  asyncData: async ({ app, route, payload }) => ({
    post: await app.$content('/lessons').get(route.path) || payload
  })
}
</script>

<style>

</style>
