const express = require('express');
const uuid = require('uuid/v4');
const logger = require('../logger');
const bookmarkDatabase = require('../bookmarks-database/bookmarks-database');

const bookmarkRouter = express.Router();
const bodyParser = express.json();

bookmarkRouter
    .route('/')
    .get((req, res) => {
        res.json(bookmarkDatabase);
    })
    .post(bodyParser, (req, res) => {
        const { title, url, description='', rating=1 } = req.body;
        console.log(req.body);

        if(!title) {
            logger.error('Title is required');
            return res
                .status(400)
                .send('Invalid data');
        }
        if(!url) {
            logger.error('url is required');
            return res
                .status(400)
                .send('Invalid data');
        }
        const id = uuid();
        const bookmark = {
            id,
            title,
            url,
            description,
            rating
        }
        bookmarkDatabase.push(bookmark);

        logger.info(`Bookmark with id ${id} created`);
        res.status(201).location(`http://localhost:8000/bookmarks/${id}`).json(bookmark);
    })

bookmarkRouter
    .route('/:id')
    .get((req, res) => {
        const {id} = req.params;
        const bookmark = bookmarkDatabase.find( b => b.id === id);

        if(!bookmark) {
            logger.error(`Bookmark with id ${id} not found.`);
            return res
                .status(404)
                .send('Card not Found');
        }
        res.json(bookmark);
    })
    .delete((req, res) => {
        const { id } = req.params;
        const bookmarkIndex = bookmarkDatabase.findIndex( b => b.id == id );

        if (bookmarkIndex === -1) {
            logger.error(`Bookmark with id ${id} not found.`);
            return res
                .status(404)
                .send('Not found');
        }

        bookmarkDatabase.splice(bookmarkIndex, 1);

        logger.info(`Bookmark with id ${id} deleted.`);
        res
            .status(204)
            .end();
    })

module.exports = bookmarkRouter