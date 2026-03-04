var express = require('express');
var router = express.Router();
let { dataRole, dataUser } = require('../data2');

// GET all roles
router.get('/', function (req, res, next) {
    res.send(dataRole);
});

// GET role by id
router.get('/:id', function (req, res, next) {
    let id = req.params.id;
    let role = dataRole.find(r => r.id === id);
    if (role) {
        res.send(role);
    } else {
        res.status(404).send({ message: "Role NOT FOUND" });
    }
});

// GET all users in a role
router.get('/:id/users', function (req, res, next) {
    let id = req.params.id;
    let role = dataRole.find(r => r.id === id);
    if (role) {
        let users = dataUser.filter(u => u.role.id === id);
        res.send(users);
    } else {
        res.status(404).send({ message: "Role NOT FOUND" });
    }
});

// POST create role
router.post('/', function (req, res, next) {
    // Generate new ID (e.g., r4)
    let maxId = 0;
    dataRole.forEach(r => {
        let num = parseInt(r.id.substring(1));
        if (num > maxId) maxId = num;
    });
    let newId = 'r' + (maxId + 1);

    let newRole = {
        id: newId,
        name: req.body.name,
        description: req.body.description,
        creationAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    dataRole.push(newRole);
    res.status(201).send(newRole);
});

// PUT update role
router.put('/:id', function (req, res, next) {
    let id = req.params.id;
    let index = dataRole.findIndex(r => r.id === id);
    if (index !== -1) {
        let role = dataRole[index];
        if (req.body.name) role.name = req.body.name;
        if (req.body.description) role.description = req.body.description;
        role.updatedAt = new Date().toISOString();
        res.send(role);
    } else {
        res.status(404).send({ message: "Role NOT FOUND" });
    }
});

// DELETE role
router.delete('/:id', function (req, res, next) {
    let id = req.params.id;
    let index = dataRole.findIndex(r => r.id === id);
    if (index !== -1) {
        let deletedRole = dataRole.splice(index, 1);
        res.send(deletedRole[0]);
    } else {
        res.status(404).send({ message: "Role NOT FOUND" });
    }
});

module.exports = router;
