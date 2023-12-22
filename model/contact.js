const mongoose = require("mongoose");


// Membuat schema
const Contact = mongoose.model('Contact', {
    nama: {
        type: String,
        required: true  
    },
    firstName: {
        type: String,
        required: true  
    },
    lastName: {
        type: String,
        required: true  
    },
    jenis_kelamin: {
        type: String,
        required: true  
    },
    noHP: {
        type: String,
        required: true  
    },
    email: {
        type: String
    }, 
    alamat: {
        type: String,
        required: true  
    },
    kategori_kontak: {
        type: String,
        required: true 
    }
});

module.exports= Contact;