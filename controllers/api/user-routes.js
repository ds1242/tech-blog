const router = require('express').Router();
const { User, Post, Comment } = require('../../models');



// GET api/users
router.get('/', (req, res) => {
    User.findAll({
        attributes: { exclude:['password'] }
    })
    .then(dbUserAllData => res.json(dbUserAllData))
    .catch(err => {
        res.status(500).json({ message: 'Unable to Get All User Information' });
    });
});

// GET /api/users/1
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Post,
                attributes: ['id','title','post_text', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            },
        ]
    })
    .then(dbUserOneData => {
        if(!dbUserOneData) {
            res.status(404).json({ message: 'Cannot find user with this id' });
            return;
        }
        res.json(dbUserOneData);
    })
    .catch(err => {
        res.status(500).json({ message: 'Something went wrong' });
    });
});

// POST to create a new user
router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserCreateData => {
        req.session.save(() => {
            req.session.user_id = dbUserCreateData.id;
            req.session.username = dbUserCreateData.username;
            req.session.loggedIn = true;
            res.json(dbUserCreateData)
        })
    })
    .catch(err => {
        res.status(500).json({ message: 'Unable to create user' });
    });
});

router.post('/login', (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(dbUserLoginData => {
        if(!dbUserLoginData) {
            res.status(404).json({ message: 'Cannot find a user with this email' });
            return;
        }
        const validPassword = dbUserLoginData.checkPassword(req.body.password);
        if(!validPassword) {
            res.status(400).json({ message: 'Incorrect Password' });
            return;
        }
        req.session.save(() => {
            req.session.user_id = dbUserLoginData.id;
            req.session.username = dbUserLoginData.username;
            req.session.loggedIn = true;

            res.json({ user: dbUserLoginData, message: 'You are now logged in' });
        });
    });
});

// Log out and delete cookie
router.post('/logout', (req, res) => {
    if(req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

// Update a User route
router.put('/:id', (req, res) => {
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
    .then(dbUserUpdate => {
        if(!dbUserUpdate[0]) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserUpdate);
    })
    .catch(err => {
        res.status(500).json({ message: 'Unable to update user' });
    });
});

// Delete a User
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserDelete => {
        if(!dbUserDelete) {
            res.status(404).json({ message: 'Unable to find user to delete' });
            return;
        }
        res.json(dbUserDelete)
    })
    .catch(err => {
        res.status(500).json(err);
    });
});


module.exports = router;