const express = require("express");
const router = express.Router();
const Item = require('./models/Item');
const ItemMessage = require('./models/message');



//Get Freinds 
router.get('/friends/:id', (req, res) => {
    Item.find({name:req.params.id})
        .then(items => res.json(items))


});

//Get messages
router.get('/messages/:id', (req, res) => {
    ItemMessage.find({ Room: req.params.id})
        .then(itemmessages => res.json(itemmessages))


});

//insert  messages into database
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

//Insert friends into db
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

/*
router.patch('/insert/messages/sender/:id', async (req, res) => {
	try {
		const post = await ItemMessage.findOne({ _id: req.params.id })

		if (req.body.title) {
			post.title = req.body.title
		}

		if (req.body.content) {
			post.content = req.body.content
		}

		await post.save()
		res.send(post)
	} catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" })
	}
})*/

module.exports = router;