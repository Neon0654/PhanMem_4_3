var express = require('express');
var router = express.Router();
let { dataUser, dataRole } = require('../data2');

// GET all users
router.get('/', function (req, res, next) {
  res.send(dataUser);
});

// GET user by username
router.get('/:username', function (req, res, next) {
  let username = req.params.username;
  let user = dataUser.find(u => u.username === username);
  if (user) {
    res.send(user);
  } else {
    res.status(404).send({ message: "User NOT FOUND" });
  }
});

// POST create user
router.post('/', function (req, res, next) {
  // Check if user already exists
  if (dataUser.find(u => u.username === req.body.username)) {
    return res.status(400).send({ message: "Username already exists" });
  }

  // Find role object if roleId is provided
  let role = null;
  if (req.body.roleId) {
    role = dataRole.find(r => r.id === req.body.roleId);
  }

  let newUser = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    fullName: req.body.fullName,
    avatarUrl: req.body.avatarUrl || "https://i.sstatic.net/l60Hf.png",
    status: req.body.status !== undefined ? req.body.status : true,
    loginCount: 0,
    role: role || {
      id: "r3",
      name: "Người dùng",
      description: "Tài khoản người dùng thông thường"
    },
    creationAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  dataUser.push(newUser);
  res.status(201).send(newUser);
});

// PUT update user
router.put('/:username', function (req, res, next) {
  let username = req.params.username;
  let index = dataUser.findIndex(u => u.username === username);
  if (index !== -1) {
    let user = dataUser[index];
    if (req.body.password) user.password = req.body.password;
    if (req.body.email) user.email = req.body.email;
    if (req.body.fullName) user.fullName = req.body.fullName;
    if (req.body.avatarUrl) user.avatarUrl = req.body.avatarUrl;
    if (req.body.status !== undefined) user.status = req.body.status;

    if (req.body.roleId) {
      let role = dataRole.find(r => r.id === req.body.roleId);
      if (role) user.role = role;
    }

    user.updatedAt = new Date().toISOString();
    res.send(user);
  } else {
    res.status(404).send({ message: "User NOT FOUND" });
  }
});

// DELETE user
router.delete('/:username', function (req, res, next) {
  let username = req.params.username;
  let index = dataUser.findIndex(u => u.username === username);
  if (index !== -1) {
    let deletedUser = dataUser.splice(index, 1);
    res.send(deletedUser[0]);
  } else {
    res.status(404).send({ message: "User NOT FOUND" });
  }
});

module.exports = router;

