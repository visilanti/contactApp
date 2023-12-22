const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://visilanti:Rahasiasilvia218@cluster0.zsf2dr2.mongodb.net/contact_app?retryWrites=true&w=majority')
  .then(() => console.log('Connected!'));
