import feathersClient from './feathers-client'

const authManagement = feathersClient.service('authManagement')

export function checkUnique (identifyUser, ownId, noErrMsg = false) {
  // check props are unique in the users items
  return authManagement.create({
    action: 'checkUnique',
    value: identifyUser, // e.g. {email, username}. Props with null or undefined are ignored.
    ownId, // excludes your current user from the search
    meta: { noErrMsg } // if return an error.message if not unique
  })
}

export function resendVerifySignup (identifyUser, notifierOptions = {}) {
  // resend sign up verification notification
  return authManagement.create({
    action: 'resendVerifySignup',
    value: identifyUser, // {email}, {token: verifyToken}
    notifierOptions: notifierOptions // options passed to options.notifier, e.g. {preferredComm: 'cellphone'}
  })
}

export function verifySignupLong (verifyToken) {
  // sign up or identityChange verification with long token
  return authManagement.create({
    action: 'verifySignupLong',
    value: verifyToken // compares to .verifyToken
  })
}

export function sendResetPwd (email) {
  // send forgotten password notification
  return authManagement.create({
    action: 'sendResetPwd',
    value: { email } // {email}, {token: verifyToken}
  })
}

export function resetPwdLong (token, password) {
  // forgotten password verification with long token
  return authManagement.create({
    action: 'resetPwdLong',
    value: {
      token, // compares to .resetToken
      password // new password
    }
  })
}

export function passwordChange (identifyUser, oldPassword, password) {
  // change password
  return authManagement.create({
    action: 'passwordChange',
    value: {
      user: identifyUser, // identify user, e.g. {email: 'a@a.com'}. See options.identifyUserProps.
      oldPassword, // old password for verification
      password // new password
    }
  })
}

export function identityChange (identifyUser, password, changes) {
  // change communications
  return authManagement.create({
    action: 'identityChange',
    value: {
      user: identifyUser, // identify user, e.g. {email: 'a@a.com'}. See options.identifyUserProps.
      password, // current password for verification
      changes // {email: 'a@a.com'} or {email: 'a@a.com', cellphone: '+1-800-555-1212'}
    }
  })
}
