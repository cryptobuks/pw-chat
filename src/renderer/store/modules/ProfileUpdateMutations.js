export default {
  setProfilePictureLink (state, url) {
    state.user = Object.assign({},
      state.user,
      { profilePicture: url }
    )
  },
  updateUserInfo (state, userInfo) {
    state.user = Object.assign({},
      state.user,
      userInfo
    )
  }
}
