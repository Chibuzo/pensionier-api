const routes = require('express').Router();
const { fetchPerson } = require('../services/peopleService');
const verifyToken = require('../middlewares/verifyToken');


routes.get('/:national_id', verifyToken, async (req, res, next) => {
    try {
        const { person, assignment = {} } = await fetchPerson(req.params.national_id);
        res.status(200).json({ status: true, data: { person, assignment } });
    } catch (err) {
        console.log(err)
        res.status(err.statusCode || 500).json({ status: false, message: err.message });
    }
});

module.exports = routes;