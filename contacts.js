//file system
const fs = require('fs');
const validator = require('validator');
const chalk = require('chalk');

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

const loadContact=() =>{
    const file = fs.readFileSync(dataPath, "utf-8");
    const contacts = JSON.parse(file);
    return contacts;
};

const saveContact = (nama, noHP, email) =>{
    const contact = {
        nama, noHP, email
    };

    const contacts = loadContact();

    //cek duplikat
    const duplikat = contacts.find((contact) => contact.nama === nama);    
    if(duplikat){
        console.log(duplikat); 
        console.log(
            chalk.red.inverse.bold('contact already registed. please use another name!')
        );
        return false;
    }

    //cek email using validator
    //cek no telp
    // const cekNoHP = validator.isMobilePhone(contact.noHP, 'id-ID');

    if(!validator.isEmail(contact.email)){
        console.log(chalk.red.inverse.bold('Email is invalid'));
        return false;
    }

    if(!validator.isMobilePhone(contact.noHP)){
        console.log(chalk.red.inverse.bold('no phone is invalid'));
        return false;
    }

    //push data
    contacts.push(contact);
    fs.writeFileSync(dataPath, JSON.stringify(contacts));

    console.log(
        chalk.blue.inverse.bold('terimakasih sudah menginput data!')
    );
};

const listContact=()=>{
    const contacs = loadContact();
    console.log(chalk.cyan.inverse.bold('Daftar Kontak : '));
    contacs.forEach((contact, i) => {
        console.log(`${i+1}. ${contact.nama} - ${contact.noHP}`);
    });
};

//mengambil dan menampilkan sebuah data
const getData=(nama)=>{
    const contacts = loadContact();
    const findData = contacts.find((contact) => contact.nama.toLowerCase() === nama.toLowerCase());
    if(!findData){
        console.log(chalk.red.inverse.bold('data not found!'));
    }else{
        console.log(findData);
    }
};

//menghapus sebuah data
const removeData = (nama) => {
    const contacts = loadContact();
    //mencari posisi index pada nama
    const newContact = contacts.filter((contact) => contact.nama.toLowerCase() !== nama.toLowerCase());

    if(contacts.length === newContact.length){
        console.log(chalk.red.inverse.bold('data tidak ditemukan'));
        return false;
    }

    fs.writeFileSync(dataPath, JSON.stringify(newContact));
    console.log(chalk.blue.inverse.bold(`${nama} berhasil dihapus!`));
};

module.exports = {
    saveContact,
    listContact,
    getData,
    removeData
};