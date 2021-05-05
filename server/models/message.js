const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const message = new Schema(

    {
       Room:String,
        me: 
            {
                name:  String,
                text:  String,
                date:  String
            }
    }
);

module.exports = ItemMessaeg = mongoose.model('ItemMessaeg', message);