import 'dotenv/config'
import { app } from './config/app'

app
  .listen({
    port: 3333,
    host: 'RENDER' in process.env ? '0.0.0.0' : 'localhost',
  })
  .then(() => {
    console.log('Server is running on port 3333')
  })
