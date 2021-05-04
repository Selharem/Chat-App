const express = require("express");
const router = express.Router();
const Item = require('./models/Item');
const ItemMessage = require('./models/message');

/*router.get("/", (req, res) => {
    res.send({ response: "Server is up and running." }).status(200);
});*/


//Get
router.get('/friends', (req, res) => {
    Item.find({name:"Hasnaa"})
        .then(items => res.json(items))


});

//Get messages
router.get('/messages/:id', (req, res) => {
    ItemMessage.find({ Room: req.params.id})
        .then(itemmessages => res.json(itemmessages))


});

//insert sender messages into database
router.post('/insert/messages/sender', (req, res) => {
    ItemMessage.collection.insert({
        Room: req.body.Room,
        me: 

            {
                name:req.body.user,
                message1: req.body.message1,
                date:req.body.date
            }


        
    })
        .then(itemmessages => res.json(itemmessages))


});

  

//insert receiver messages into database
router.post('/insert/messages/receiver', (req, res) => {
    ItemMessage.collection.insert({
        you: 

            {
                name: req.body.user,
                message1: req.body.message1
            }


        
    })
        .then(itemmessages => res.json(itemmessages))


});



// Post
router.post('/post', (req, res) => {
    const newItem = new Item({
        name: req.body.name,
        Friends: [
            {
                namef: req.body.Friends[0].namef,
                room: req.body.Friends[0].room
            },
            {
                namef: req.body.Friends[1].namef,
                room: req.body.Friends[1].room
            },
            {
                namef: req.body.Friends[2].namef,
                room: req.body.Friends[2].room
            }
        ]


    });

    newItem.save()
        .then(item => res.json(item))

});

//Post message 
router.post('/post/message', (req, res) => {
    const newItem = new ItemMessage({

        sender: [

            {
                name:req.body.sender[0].name,
                text:req.body.sender[0].text
            }


        ],
        receiver: [
            {
                name: req.body.receiver[0].name,
                text: req.body.receiver[0].text,
            }

        ]

    });

    newItem.save()
        .then(item => res.json(item))

});





module.exports = router;