const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));
const validation = require("../utils/validation");

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");
const {isIdMatchingWithRouteId} = require("../utils/validation");

function list(req, res, next) {
    res.status(200).json({data: dishes})
}

function create(req, res, next) {
    const { data } = req.body;
    const newDish = {
        id: nextId(),
        ...data
    }
    dishes.push(newDish);
    res.status(201).json({data: newDish});
}

function isExists(req, res, next) {
    const {dishId} = req.params
    const dishFound = dishes.find(dish => dish.id === dishId)
    if (dishFound) {
        res.locals.dish = dishFound;
        next()
    } else {
        next({
            status: 404,
            message: `Dish does not exist: ${dishId}.`
        })
    }
}

function read(req, res) {
    const dish = res.locals.dish;
    res.status(200).json({data: dish})
}

function update(req, res) {
    const dish = res.locals.dish;
    const body = req.body.data;
    let id;
    if (body.id) {
        id = body.id;
    } else {
        id = dish.id
    }
    res.json({ data: { id, ...body } });
}

module.exports = {
    create: [
        validation.validateObjectStringKeys('name', 'Dish'),
        validation.validateObjectStringKeys('description', 'Dish'),
        validation.validateObjectStringKeys('image_url', 'Dish'),
        validation.validateObjectIntegerKeys('price', 'Dish'),
        create
    ],
    list,
    read: [
        isExists,
        read
    ],
    update: [
        isExists,
        isIdMatchingWithRouteId('dishId', 'Dish'),
        validation.validateObjectStringKeys('name', 'Dish'),
        validation.validateObjectStringKeys('description', 'Dish'),
        validation.validateObjectStringKeys('image_url', 'Dish'),
        validation.validateObjectIntegerKeys('price', 'Dish'),
        update
    ]
}

