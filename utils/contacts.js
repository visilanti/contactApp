//file system
const fs = require('fs');
// const validator = require('validator');
// const chalk = require('chalk');

const directoryPath = './data';
const dataPath = './data/contacts.json';

//cek direktori jika tidak ada
if(!fs.existsSync(directoryPath)){
    fs.mkdirSync(directoryPath);
}

//cek file jika contacts.json jika tidak ada
if(!fs.existsSync(dataPath)){
    fs.writeFileSync(dataPath, '[]', 'utf-8');
}

//ambil semua data contact.json
const loadContact=() =>{
    const file = fs.readFileSync(dataPath, "utf-8");
    const contacts = JSON.parse(file);
    return contacts;
};

//cari kontak berdasarkan nama
const findContact = (nama) => {
    const contacts = loadContact();
    const contact = contacts.find(
        (contact) => contact.nama.toLowerCase() === nama.toLowerCase()
    );
    return contact;
}

//menuliskan/menimpa file contacts.json dg data yg baru
const saveContacts = (contacts) => {
    fs.writeFileSync('data/contacts.json', JSON.stringify(contacts));
};

//menambah data contact baru
const addContact = (contact) => {
    const contacts = loadContact();
    contacts.push(contact);
    saveContacts(contacts);
}

//cek duplikat
const cekDuplikat = (nama) =>{
    const contacts = loadContact();
    return contacts.find((contact) => contact.nama === nama);  
};

module.exports ={
    loadContact, findContact, addContact, cekDuplikat
}
