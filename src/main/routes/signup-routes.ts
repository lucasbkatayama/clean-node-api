import { Router } from 'express'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

export default (router: Router): void => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  
  router.post('/signup', (req, res) => {
    res.json({ ok: 'ok' })
  })
}