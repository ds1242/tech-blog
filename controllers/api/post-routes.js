const router = require('express').Router();
const { User, Post, Comment } = require('../../models');



// Post GET All
router.get('/', (req, res) => {
    Post.findAll({
        attributes: ['id', 'post_text', 'title', 'created_at'],
        order: [['created_at', 'DESC']],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostAll => res.json(dbPostAll))
    .catch(err => {
        res.status(500).json({ message: 'Cannot Find Posts'})
    });
});

// GET One Post
router.get('/:id', (req, res) => {
    Post.findOne({
        where: { id: req.params.id },
        attributes: ['id', 'post_text', 'title', 'created_at'],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPost => {
        if(!dbPost) {
            res.status(404).json({ message: 'Cannot find a post with that id' });
            return;
        }
        res.json(dbPost)
    })
    .catch(err => {
        res.status(500).json({ message: 'Error trying to find that post' });
    });
});

// POST a new Post 
router.post('/', (req, res) => {
    Post.create({
        title: req.body.title,
        post_text: req.body.post_text,
        user_id: req.session.user_id 
    })
    .then(dbPostCreate => res.json(dbPostCreate))
    .catch(err => {
        res.status(500).json({ message: 'Unable To Create A Post' })
    });
});

// Update a Post
router.put('/:id', (req, res) => {
    Post.update(
        {
            title: req.body.title,
            post_text: req.body.post_text
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
    .then(dbPostUpdate => {
        if (!dbPostUpdate) {
            res.status(404).json({ message: 'Cannot Update the Post' });
            return;
        }
        res.json(dbPostUpdate);
    })
    .catch(err => {
        res.status(500).json({ message: 'Error Updating Post'});
    });
});

// DELETE a Post
router.delete('/:id', (req, res) => {
    Post.destroy(
        {
            where: { id: req.params.id }
        })
    .then(dbPostDelete => res.json(dbPostDelete))
    .catch(err => {
        res.status(500).json({ message: 'Something went wrong deleting the post' });
    });
});

module.exports = router;