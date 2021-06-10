const router = require('express').Router();
const { User, Post, Comment } = require('../../models');


// GET api/users

router.get('/', (req, res) => {
    User.findAll({})
    .then(dbUserAllData => res.json(dbUserAllData))
    .catch(err => {
        res.status(500).json({ message: 'Unable to Get All User Information' });
    });
});


router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserCreateData => res.json(dbUserCreateData))
    .catch(err => {
        res.status(500).json({ message: 'Unable to create user' });
    });
});

module.exports = router;