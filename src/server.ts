import 'dotenv/config'
import { env } from './src/env'
import { app } from './config/app'

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.log('Server is running on port 3333')
  })
