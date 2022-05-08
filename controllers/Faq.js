const FaqModal = require('../models/schemas/faq')

exports.addFaq = async (req, res) => {
    try {

        let addFaq= await FaqModal.create(req.body);

        res.status(200).json({
            status: 'success',
            data: addFaq
        });

    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
}

exports.getAllFaq = async (req, res) => {
    try {

        let allFaq= await FaqModal.find();

        res.status(200).json({
            status: 'success',
            data: allFaq
        });

    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
}