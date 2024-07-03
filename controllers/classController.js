const { Class } = require('../models');

exports.createClass = async (req, res) => {
    const { nurseryId } = req.params;
    const { name, year, babysitterId } = req.body;

    try {
        const classItem = await Class.create({
            name,
            year,
            babysitterId,
            nurseryId
        });

        res.status(201).json(classItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
