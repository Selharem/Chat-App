const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        Friends: [

            {

                namef: {
                    type: String,
                    required: true
                },
                room: {
                    type: String,
                    required: true
                }
            },
            {

                namef: {
                    type: String,
                    required: true
                },
                room: {
                    type: String,
                    required: true
                }
            },
            {
                namef: {
                    type: String,
                    required: true
                },
                room: {
                    type: String,
                    required: true
                }
            }


        ]
    });


module.exports = Item = mongoose.model('Item', ItemSchema);
