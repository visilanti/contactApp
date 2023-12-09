const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const {loadContact, findContact, addContact, cekDuplikat} = require('./utils/contacts.js');
const {body, validationResult, check} = require('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const app = express();
const port = 4000;

//gunakan ejs
app.set('view engine', 'ejs');
app.use(expressLayouts);

//built-in middleware
//memanggil semua asset di publc
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

app.use(cookieParser('secret'));
app.use(session({
    cookie: { maxAge: 6000},
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
})
);
app.use(flash());

app.get('/contact', (req, res)=>{
    const contacts = loadContact();

    res.render('contact', {
        layout: 'layouts/main-layout',
        title: 'contact',
        contacts,
        msg: req.flash('msg')
    });
})

//halaman tambah contact
app.get('/contact/add', (req, res) => {
    res.render('add-contact', {
        title: 'Form Data Contact',
        layout: 'layouts/main-layout'
    });
})

app.post('/contact', [
    body('nama').custom((value) => {
        const duplikat = cekDuplikat(value);
        if(duplikat){
            throw new Error('Nama kontak sudah digunakan!');
        }
        return true;
    }),
    check('email', 'email tidak valid!').isEmail(),
    check('noHP', 'No HP tidak valid!').isMobilePhone('id-ID')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // return res.status(400).json({ errors: errors.array() });
        res.render('add-contact', {
            title: 'form tambah data contact',
            layout: 'layouts/main-layout',
            errors: errors.array(),
        });
    }else{
        addContact(req.body);
        //kirimkan msg flash
        req.flash('msg', 'Data kontak berhasil ditambahkan');
        res.redirect('/contact');
    }
});

//dua route berikut ini harus disimpan diakhir
app.get('/contact/:nama', (req, res)=>{
    const contact = findContact(req.params.nama);

    res.render('detail', {
        layout: 'layouts/main-layout',
        title: 'Halaman detail contact',
        contact
    });
})

app.get('/about', (req, res)=>{
    res.render('about', {
        layout: 'layouts/main-layout',
        title: 'about'
    });
});

app.get('/', (req, res)=>{
    const mahasiswa=[
        {
            nama: 'janah siti',
            email: 'janah@gmail.com',
        },
        {
            nama: 'suci',
            email: 'sucay@yahoo.com'
        },
        {
            nama: 'datul',
            email: 'datul@gmail.com'
        },
    ];

    res.render('index', {
        layout: 'layouts/main-layout',
        nama: 'Silvia ahoyy', 
        title:'Halaman Home',
        mahasiswa,
    });
})

app.use('/', (req, res) => {
    res.status(404);
    res.send('<h1>Oops ERROR 404!</h1>');
})


app.listen(port, ()=>{
    console.log(`Listening at http://localhost:${port}`);
});
