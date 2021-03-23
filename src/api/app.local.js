const app = require('./src/app')
const PORT = 3000

app.listen(PORT, () => {
  console.info(`Server listening on http://localhost:${PORT}`)
})

