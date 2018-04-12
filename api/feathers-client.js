import feathers from 'feathers/client'
import hooks from 'feathers-hooks'
import socketio from 'feathers-socketio/client'
import auth from 'feathers-authentication-client'
import io from 'socket.io-client'
import { CookieStorage } from 'cookie-storage'

const socket = io(process.env.HOST_URL_API_SSO, {transports: ['websocket']})

const app = feathers()
  .configure(hooks())
  .configure(socketio(socket))
  .configure(auth({ jwtStrategy: 'jwt', cookie: 'feathers-jwt', storage: new CookieStorage({path: '/'}) }))

export default app
