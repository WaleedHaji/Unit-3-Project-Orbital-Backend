
// imports
const connectToDB = require('./config/db.js')
const express = require("express")
const app = express()
const dotenv = require("dotenv").config()
const morgan = require('morgan')
const cors = require('cors')

const dns = require("dns")
dns.setServers(["8.8.8.8", "1.1.1.1"])

// Routes Import
const authRoutes = require('./routes/auth.routes')
const adminRoutes = require('./routes/admin.routes.js')
const spaceMissionsRoutes = require('./routes/spaceMissions.routes')
const astronautsRoutes = require("./routes/astronauts.routes");

// Middleware
app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
    })
)
app.use(express.json())
app.use(morgan('dev'))

// Routes
app.use('/auth', authRoutes)
app.use('/admin', adminRoutes)
app.use('/missions', spaceMissionsRoutes)
app.use('/astronauts', astronautsRoutes)

// connect to database and listen on Port 3000
async function startServer() {
    const PORT = process.env.PORT || 3000
    await connectToDB()

    app.listen(PORT, () => {
        console.log(`App is running on port ${PORT}`)
    })
}

startServer()
