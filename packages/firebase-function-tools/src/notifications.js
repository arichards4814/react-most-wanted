const admin = require('firebase-admin')

module.exports = {
  notifyUser: (userUid, payload, tokensBasePath = 'notification_tokens') => {
    console.log(userUid, payload)

    return admin
      .database()
      .ref(`/${tokensBasePath}/${userUid}`)
      .once('value')
      .then(snapshot => {
        let registrationTokens = []

        snapshot.forEach(token => {
          if (token.val()) {
            registrationTokens.push(token.key)
          }
        })

        if (registrationTokens.length) {
          return admin.messaging().sendToDevice(registrationTokens, payload)
        } else {
          console.log('Not tokens registered')
          return null
        }
      })
  },
}
