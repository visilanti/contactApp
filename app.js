const yargs = require('yargs');
const contacts = require('./contacts');

yargs.command({
    command : 'add', 
    desc : 'add new contacs',
    builder : {
        nama: {
            describe: 'nama lengkap',
            demandOption : true,
            type : 'string',
        },
        email: {
            describe: 'email aktif',
            demandOption: false,
            type: 'string',
        },
        noHP: {
            describe : 'no hp',
            demandOption: true,
            type: 'string',
        },
    },
    handler (argv) {
        contacts.saveContact(argv.nama, argv.noHP, argv.email);
    },
}).demandCommand();
 
//menampilkan daftar semua nama dan no hp contact
yargs.command({
    command: 'list',
    describe: 'menampilkan semua nama dan no hp',
    handler(){
        contacts.listContact();
    }
})

//menampilkan detail sebuah kontak
yargs.command({
    command: 'detail',
    describe: 'detail sebuah kontak',
    builder: {
        nama: {
            describe: 'nama lengkap',
            demandOption : true,
            type : 'string',
        }
    }, 
    handler(argv){
        contacts.getData(argv.nama);
    }
});

yargs.command({
    command: 'remove',
    describe: 'menghapus sebuah data',
    builder: {
        nama: {
            describe: 'nama lengkap',
            demandOption : true,
            type : 'string',
        },
    },
    handler(argv){
        contacts.removeData(argv.nama);
    }
});

yargs.parse();





















// const main = async() => {
//     const nama = await writePertanyaan('What is yourname? ');
//     const noHP = await writePertanyaan('What is ur no Hp? ');
//     const email = await writePertanyaan('What is ur email? ');

//     saveContact(nama, noHP, email);
// }

// main();

