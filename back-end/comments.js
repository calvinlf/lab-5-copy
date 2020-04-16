const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()

const users = require('./users.js')
const User = users.model
const validUser = users.valid
const photos = require('./photos.js')
const Photo = photos.model
const validPhoto = photos.valid

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    photo: {
        type: mongoose.Schema.ObjectId,
        ref: 'Photo'
    },
    text: String,
    created: {
        type: Date,
        default: Date.now
    },
})

const Comment = mongoose.model('Comment', commentSchema)

// upload comment
router.post('/', validUser, validPhoto, async (req, res) => {
    const comment = new Comment({
        user: req.user,
        photo: req.photo,
        text: req.body.text
    })
    try {
        await comment.save()
        return res.send(comment)
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const photo = await Photo.findOne({
            _id: req.params.id
        })
        let comments = await Comment.find({
            photo: photo
        }).populate('user').populate('photo').sort({
            created: -1
        })
        return res.send(comments)
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
})

module.exports = {
    model: Comment,
    routes: router,
}

