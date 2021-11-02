const express = require('express');
const Users = require('./users-model')
const Posts = require('../posts/posts-model')

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', (req, res) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  Users.get()
      .then(users => {
        res.status(200).json(users)
      })
      .catch(err => {
        res.status(500).json({message: 'Error in the server'})
      })
});

router.get('/:id', async (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id

  try {
    const {id} = req.params;
    const user = await Users.getById(id)

    if (!user) {
      res.status(404).json({message: 'User not found'})
    } else {
      res.status(200).json(user)
    }

  } catch (error) {
    res.status(500).json({message: 'Error in server'})
  }
});

router.post('/', async (req, res) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  try {
    const {name} = req.body

    if (!name) {
      res.status(404).json({message: 'User needs a name!'})
    } else {
      const newUser = await Users.insert({name})
      res.status(200).json(newUser)
    }

  } catch (error) {
    res.status(500).json({message: 'Error with the server'})
  }

});

router.put('/:id', async (req, res) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid

  try {
    const {id} = req.params
    const {name} = req.body

    if (!name) {
      res.status(400).json({message: 'User needs a name!'})
    } else {
      const updatedUser = await Users.update(id, {name})

      if(updatedUser) {
        res.status(200).json(updatedUser)
      } else {
        res.status(404).json({message: 'User not found'})
      }
    }

  } catch (error) {
    res.status(500).json({message: 'Error with server!'})
  }

});

router.delete('/:id', async (req, res) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id

  try {
    const {id} = req.params
    const deleteUser = await Users.remove(id)

    if(!deleteUser){
      res.status(404).json({message: 'The user with the specified ID does not exist'})
    } else {
      res.status(200).json(deleteUser)
    }
  } catch (error) {
    res.status(500).json({message: 'Error in server!'})
  }

});

router.get('/:id/posts', async (req, res) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  try{
    const {id} = req.params
    const posts = await Posts.getById(id)

    if(!posts) {
      res.status(404).json('Posts do not exists')
    } else {
      res.status(200).json(posts)
    }

  } catch (error) {
    res.status(500).json({message: 'Error in server!'})
  }

});

router.post('/:id/posts', async (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid

  try{
    const {text, user_id} = req.body
    if(!text || ! user_id) {
      res.status(400).json({message: 'Posts need some text my dude!'})
    } else {
      const newPost = await Posts.insert({text, user_id})
      res.status(201).json(newPost)
    }
  } catch (error) {
    res.status(500).json({message: 'Error with server!'})
  }

});

// do not forget to export the router
module.exports = router