import { bootstrap } from '@app/runtime'
import { AppModule } from './app.module'

bootstrap(AppModule).catch((e) => {
  console.error(e)
})
