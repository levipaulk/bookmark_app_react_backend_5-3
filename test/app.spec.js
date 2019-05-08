require('dotenv').config();
const app = require('../src/app')

describe('App', () => {
  it('GET / responds with 200 containing "Hello, world!"', () => {
    return supertest(app)
      .get('/')
      .set('Authorization', `something ${process.env.REACT_APP_API_KEY}`)
      .expect(200, 'Hello, boilerplate!')
  })
})