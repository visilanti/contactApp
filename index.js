const express = require('express');
const expressLayouts = require('express-ejs-layouts');
// const {loadContact, findContact, addContact, cekDuplikat, removeData} = require('./utils/contacts.js');
require('./utils/db');
const Contact = require('./model/contact');

const {body, validationResult, check} = require('express-validator');
const methodOverride = require('method-override');

const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const app = express();
const port = 4000;

//setup method override
app.use(methodOverride('_method'));

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

app.get('/contact', async (req, res)=>{
    const contacts = await Contact.find();

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
    body('nama').custom( async (value) => {
        const duplikat = await Contact.findOne({ nama: value });
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
        res.render('add-contact', {
            title: 'form tambah data contact',
            layout: 'layouts/main-layout',
            errors: errors.array(),
        });
    }else{
        Contact.insertMany(req.body)
        .then(result => {
            // Kirimkan msg flash
            req.flash('msg', 'Data kontak berhasil ditambahkan');
            res.redirect('/contact');
        })
        .catch(error => {
            // Handle the error
            console.error('Error inserting documents:', error);
            // You can also send an error flash message if needed
            req.flash('error', 'Error adding contacts');
            res.redirect('/contact');
        });
    }
});

//dua route berikut ini harus disimpan diakhir
app.get('/contact/:nama', async (req, res)=>{
    // const contact = findContact(req.params.nama);
    const contact = await Contact.findOne({nama : req.params.nama});

    res.render('detail', {
        layout: 'layouts/main-layout',
        title: 'Halaman detail contact',
        contact
    });
    
})

//route delete
app.delete('/contact', async (req, res) => {
    // const contact = removeData(req.params.nama);
    //     res.render('detail', {
    //         layout: 'layouts/main-layout',
    //         title: 'Halaman detail contact',
    //         contact
    //     });

    // const contact = await Contact.findOne({nama: req.params.nama});
    // if(!contact){
    //     res.status(404);
    //     res.send('<h1>404</h1>');
    // }else{
    //     Contact.deleteOne({nama: req.params.nama});
    //     req.flash('msg', 'Data berhasil dihapus');
    //     res.redirect('/contact');
    // }

    Contact.deleteOne({ nama: req.body.nama}).then((result) => {
        req.flash('msg', 'Data berhasil dihapus');
        res.redirect('/contact');
    });
});

app.put('/contact', [
    body('nama').custom(async (value, { req }) => {
        try {
            const duplikat = await Contact.findOne({ nama: value });
            if (value !== req.body.oldNama && duplikat) {
                throw new Error('Username contact sudah digunakan');
            }
            return true;
        } catch (error) {
            throw new Error('Terjadi kesalahan pada validasi nama.');
        }
    }),
    check('email', 'Email tidak valid!').isEmail(),
    check('noHP', 'No HP tidak valid!').isMobilePhone(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('edit-contact', {
            title: 'Form Ubah Data Contact',
            layout: 'layouts/main-layout',
            errors: errors.array(),
            contact: req.body,
        });
    } else {
        try {
            const updatedData = {
                nama: req.body.nama,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                jenis_kelamin: req.body.jenis_kelamin,
                noHP: req.body.noHP,
                email: req.body.email,
                alamat: req.body.alamat,
                kategori_kontak: req.body.kategori_kontak,
            };

            const result = await Contact.updateOne(
                { nama : req.body._id },
                { $set: updatedData }
            );

            if (result.nModified > 0) {
                req.flash('msg', 'Data Contact Berhasil Diubah!');
                res.redirect('/contact');
            } else {
                req.flash('msg', 'Tidak ada perubahan pada data Contact.');
                res.redirect('/contact');
            }
        } catch (error) {
            console.error(error);
            req.flash('msg', 'Terjadi kesalahan saat mengubah data Contact.');
            res.redirect('/contact');
        }
    }
});

//halaman form edit data contact
app.get('/contact/edit/:nama', async(req, res) => {
    const contact = await Contact.findOne({ nama: req.params.nama });

    res.render('edit-contact', {
        title: 'Form Ubah Data Contact',
        layout: 'layouts/main-layout',
        contact,
    });
});

app.get('/about', (req, res)=>{
    res.render('about', {
        layout: 'layouts/main-layout',
        title: 'about'
    });
});

app.get('/', (req, res)=>{
    res.render('index', {
        layout: 'layouts/main-layout',
        title:'Halaman Home',
    });
})

app.use('/', (req, res) => {
    res.status(404);
    res.send('<h1>Oops ERROR 404!</h1>');
})


app.listen(port, ()=>{
    console.log(`Listening at http://localhost:${port}`);
});
