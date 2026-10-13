import 'dotenv/config'
import app from './src/app.ts'

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is listening on port ${process.env.PORT}`)
})