export default {
  async copyContacts ({ rootState, dispatch }) {
    const user = rootState.auth.user
    if (!user) {
      return undefined
    }
    const contactList = user.contacts
    dispatch('addOrUpdateList', contactList)
    return Promise.resolve()
  }
}
