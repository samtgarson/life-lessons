export const state = () => ({
  hover: false
})

export const mutations = {
  updateHover (s, hover) {
    s.hover = hover
  }
}
