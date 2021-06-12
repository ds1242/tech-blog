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


module.exports = router;