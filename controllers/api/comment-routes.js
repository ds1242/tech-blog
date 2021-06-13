const router = require('express').Router();
const { User, Post, Comment } = require('../../models');

// GET all comments
router.get('/', (req, res) => {
    Comment.findAll({})
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => {
        res.status(400).json({ message: 'Something went wrong getting all comments' });
    });
});


// POST Comment
router.post('/', (req, res) => {
    // NEEED A SESSION CHECK HERE
    Comment.create({
        comment_text: req.body.comment_text,
        post_id: req.body.post_id,
        user_id: req.session.user_id
    })
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => {
        res.status(500).json({ message: 'Something went wrong creating a comment' })
    });
});

// DELETE Comment
router.delete('/:id', (req, res) => {
    Comment.destroy({
        where: { id: req.params.id }
    })
    .then(dbCommentDelete => res.json(dbCommentDelete))
    .catch(err => {
        res.status(500).json({ message: 'Something went wrong deleting the comment' })
    });
});

module.exports = router;