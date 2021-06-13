const router = require('express').Router();
const { Post, User, Comment } = require('../models');

router.get('/', (req, res) => {
    Post.findAll({
        where: {
            user_id: req.session.user_id
        },
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
    .then(dbUserPostData => {
        const posts = dbUserPostData.map(post => post.get({ plain: true }));
        res.render('dashboard', {posts, loggedIn: true});
    })
    .catch(err => {
        res.status(500).json({ message: 'Something went wrong' });
    });
});

router.get('/edit/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
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
    .then(dbPostSingle => {
        if(!dbPostSingle) {
            res.status(404).json({ message: 'Unable to find post to edit' });
            return;
        }
        const post = dbPostSingle.get({ plain: true });

        res.render('edit-post', {
            post,
            loggedIn: true
        })
    })
    .catch(err => {
        res.status(500).json({ message: 'Something went wrong trying to find and load the post' });
    });
});

module.exports = router;