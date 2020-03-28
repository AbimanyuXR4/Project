const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const jwt = require('jsonwebtoken')

//membuat aplikasi framework express
const app = express()

//inisialisasi secret key yang digunakan oleh JWT
const secretKey = 'thisisverysecretkey'

//enable body-parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

//koneksi -> database
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'project2'
})

conn.connect((err) => {
    if (err) throw err
    console.log('Database Connected............')
})

const isAuthorized = (req, res, next) => {
    if (typeof (req.headers['x-api-key']) == 'undefined') {
        return res.status(403).json({
            success: false,
            message: 'Unathorized Token is not provided'
        })
    }


    //get token dari headers
    let token = req.headers['x-api-key']

    //melakukuan verivikasi token yang dikirim user
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Unathorized Token'
            })
        }
    })

    //lanjut ke next req
    next()
}

//=========== list end point ============//

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Selamat Datang'
    })
})

//Login Admin
app.post('/auth', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        conn.query('SELECT * FROM admin WHERE username = ? AND password = ?', [username, password], function (error, results, fields) {
            if (results.length > 0) {
                const token = jwt.sign(username + ' | ' + password, secretKey)
                res.json({
                    success: true,
                    message: 'OEEEEEEEEEEEEEEE',
                    token: token
                })
            } else {
                res.send('Incorrect Username and/or Password!');
            }
            res.end();
        });
    } else {
        res.send('Please enter Username and Password!');
        res.end();
    }
});

//Alat Pelindung Diri

app.get('/apd', isAuthorized, (req, res) => {
    let sql = 'select * from apd'
    conn.query(sql, (err, result) => {
        if (err) throw err
        res.json({
            success: true,
            message: 'APD',
            data: result
        })
    })
})

app.get('/apd/:id', isAuthorized, (req, res) => {
    let sql = `
        select * from apd
        where id_apd = ` + req.params.id + `
        limit 1
    `

    conn.query(sql, (err, result) => {
        if (err) throw err

        res.json({
            message: "success get user's detail",
            data: result[0]
        })
    })
})


app.post('/apd', isAuthorized, (req, res) => {
    let data = req.body
    let sql = `
        insert into apd(nama_apd, stok, deskripsi)
        values('` + data.nama_apd + `','` + data.stok + `','` + data.deskripsi + `');
    `

    conn.query(sql, (err, result) => {
        if (err) throw err
    })
    res.json({
        success: true,
        message: 'Mantap Gaaan'
    })
})

app.put('/apd/:id', isAuthorized, (req, result) => {
    let data = req.body
    let sql = `
        update apd
        set nama_apd = '` + data.nama_apd + `', stok = '` + data.stok + `', deskripsi = '` + data.deskripsi + `'
        where id_apd = ` + req.params.id + `
    `

    conn.query(sql, (err, result) => {
        if (err) throw err
    })
    result.json({
        success: true,
        message: 'Sipppp'
    })
})


app.delete('/apd/:id', isAuthorized, (req, result) => {
    let sql = `
        delete from apd where id_apd = ` + req.params.id + `
    `

    conn.query(sql, (err, res) => {
        if (err) throw err
    })
    result.json({
        success: true,
        message: 'Data berhasil dihapus'
    })
})

//Rumah Sakit

app.post('/rs/auth', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        conn.query('SELECT * FROM rs WHERE username = ? AND password = ?', [username, password], function (error, results, fields) {
            if (results.length > 0) {
				res.send('Berhasil Login Sebagai RS')
            } else {
                res.send('Incorrect Username and/or Password!');
            }
            res.end();
        });
    } else {
        res.send('Please enter Username and Password!');
        res.end();
    }
});


app.get('/rs', isAuthorized, (req, res) => {
    let sql = 'select * from rs'
    conn.query(sql, (err, result) => {
        if (err) throw err
        res.json({
            success: true,
            message: 'Rumah Sakit',
            data: result
        })
    })
})

app.get('/rs/:id', isAuthorized, (req, res) => {
    let sql = `
        select * from rs
        where id_rs = ` + req.params.id + `
        limit 1
    `

    conn.query(sql, (err, result) => {
        if (err) throw err

        res.json({
            message: "Berhasil mendapatkan data rumah sakit",
            data: result[0]
        })
    })
})


app.post('/rs', isAuthorized, (req, res) => {
    let data = req.body
    let sql = `
        insert into rs(nama_rs, kepala_rs, no_telp, username, password)
        values('` + data.nama_rs + `','` + data.kepala_rs + `','` + data.no_telp + `','` + data.username + `','` + data.password + `');
    `

    conn.query(sql, (err, result) => {
        if (err) throw err
    })
    res.json({
        success: true,
        message: 'Data berhasil disimpan'
    })
})

app.put('/rs/:id', isAuthorized, (req, result) => {
    let data = req.body
    let sql = `
        update rs
        set nama_rs = '` + data.nama_rs + `', kepala_rs = '` + data.kepala_rs + `', no_telp = '` + data.no_telp + `', username = '` + data.username + `', password = '` + data.password + `'
        where id_rs = ` + req.params.id + `
    `

    conn.query(sql, (err, result) => {
        if (err) throw err
    })
    result.json({
        success: true,
        message: 'Data berhasil diubah'
    })
})


app.delete('/rs/:id', isAuthorized, (req, result) => {
    let sql = `
        delete from rs where id_rs = ` + req.params.id + `
    `

    conn.query(sql, (err, res) => {
        if (err) throw err
    })
    result.json({
        success: true,
        message: 'Data berhasil dihapus'
    })
})

//Transaksi

app.get('/pesanan', isAuthorized, (req, res) => {
    let sql = 'select * from distribusi'
    conn.query(sql, (err, result) => {
        if (err) throw err
        res.json({
            success: true,
            message: 'Pesanan',
            data: result
        })
    })
})

app.get('/pesanan/:id', isAuthorized, (req, res) => {
    let sql = `
        select * from distribusi
        where id = ` + req.params.id + `
        limit 1
    `

    conn.query(sql, (err, result) => {
        if (err) throw err

        res.json({
            message: "Berhasil mendapatkan data transaksi",
            data: result[0]
        })
    })
})

app.post('/apd/:id_apd/pesan', isAuthorized, (req, res) => {
    let data = req.body

    conn.query(`
        insert into distribusi (id_rs, id_apd, ambil)
        values ('` + data.id_rs + `', '` + req.params.id_apd + `', '` + data.ambil + `')
    `, (err, result) => {
        if (err) throw err
    })

    conn.query(`
        update apd
        set stok = stok - '` + data.ambil + `'
        where id_apd = '` + req.params.id_apd + `'
    `, (err, result) => {
        if (err) throw err
    })

    res.json({
        message: "Berhasil melakukan transaksi, ditunggu ya :)"
    })
});

app.delete('/apd/:id/:id_apd', isAuthorized, (req, res) => {
    let data = req.body

    conn.query(`
        delete from distribusi where id = ` + req.params.id + `
    `, (err, result) => {
        if (err) throw err
    })

    conn.query(`
        update apd
        set stok = stok + '` + data.ambil + `'
        where id_apd = '` + req.params.id_apd + `'
    `, (err, result) => {
        if (err) throw err
    })

    res.json({
        message: "Mantap SLUUUUUUUUUUUUUURD"
    })
})

//Port

app.listen(8231, () => {
    console.log('CONEEEEEEEEEEEEEEEEEEEECT.............')
})