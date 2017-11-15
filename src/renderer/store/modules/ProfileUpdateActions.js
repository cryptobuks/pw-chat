export default {
  profilePicUpdated ({ commit }, url) {
    if (url && url.trim() !== '') {
      commit('setProfilePictureLink', url)
    }
  },
  userDetailsUpdated ({ commit }, userInfo) {
    if (userInfo) {
      commit('updateUserInfo', userInfo)
    }
  }
}
