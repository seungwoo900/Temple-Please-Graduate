const PORT = process.env.PORT ?? 8000
const express = require('express')
const cors = require('cors')
const app = express()
const pool = require('./db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

app.use(cors())
app.use(express.json())

app.get('/:userEmail', async (req, res) => {
    const {userEmail} = req.params

    try {
        const my_major = await pool.query('SELECT * FROM user_major WHERE user_email = $1', [userEmail])
        res.json(my_major.rows)
        console.log(res)
    } catch (error) {
        console.error(error)
    }
})

// get courses
app.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM major')
        res.json(result.rows)
    } catch (error) {
        console.error(error)
    }
})

app.get('/search/:courseCode', async (req, res) => {
    const {courseCode} = req.params

    try {
        const result = await pool.query('SELECT * FROM major WHERE subject = $1', [courseCode])
        res.json(result.rows)
    } catch (error) {
        console.error(error)
    }
})

app.post('/add-course', async (req, res) => {
    const {userEmail, subject, title, credits} = req.body

    try {
        const newCourse = await pool.query(
            'INSERT INTO user_major (user_email, subject, title, credits) VALUES ($1, $2, $3, $4) RETURNING *',
            [userEmail, subject, title, credits]
        )
        res.json(newCourse.rows[0])
    } catch (error) {
        console.error(error)
    }
})

app.delete('/delete-course/:id', async (req, res) => {
    const {id} = req.params

    try {
        await pool.query('DELETE FROM user_major WHERE id = $1', [id])
        res.json({success: true})
    } catch (error) {
        console.error(error)
    }
})

// signup
app.post('/signup', async (req, res) => {
    const {email, password} = req.body
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)

    try {
        const users = await pool.query('SELECT * FROM users WHERE email = $1', [email])

        if(users.rows.length) return res.json({detail: 'User already exists!'})

        const signUp = await pool.query(`INSERT INTO users (email, hashed_password) VALUES($1, $2)`,
            [email, hashedPassword])
        
        const token = jwt.sign({email}, 'secret', {expiresIn: '1hr'})
        res.json({email, token})
    } catch (error) {
        console.error(error)
        if(error) {
            res.json({detail: error.default})
        }
    }
})

// login
app.post('/login', async(req, res) => {
    const {email, password} = req.body
    try {
        const users = await pool.query('SELECT * FROM users WHERE email = $1', [email])

        if(!users.rows.length) return res.json({detail: 'User does not exist!'})
            
        const success = await bcrypt.compare(password, users.rows[0].hashed_password)
        const token = jwt.sign({email}, 'secret', {expiresIn: '1hr'})

        if(success) {
            res.json({'email':users.rows[0].email, token})
        } else {
            res.json({detail: 'Login failed'})
        }
    } catch (error) {
        console.error(error)
    }
})

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))