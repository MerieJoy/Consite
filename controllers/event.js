const { validationResult } = require('express-validator');

const Event = require('../models/event');

exports.fetchAll = async (req, res, next) => {
    try {
        const [allEvents] = await Event.fetchAll();
        
        const formattedEvents = allEvents.map(event => {
            const formattedDate = new Date(event.event_date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            return {
                ...event,
                event_date: formattedDate
            };
        });
        
        res.status(200).json(formattedEvents);
        
    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.postEvent = async (req, res, next) => {

    let file = "";
    if(req.file){
        file = req.file.path;
    }
    console.log(file);

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const extractedErrors = [];
        errors.array().map(err => extractedErrors.push( err.msg ));
        return res.json({ messages: extractedErrors});
    }

    const path = file.replace('frontend\\', '');

    const admin_id = req.body.admin_id;
    const church_id = req.body.church_id;
    const event_date = req.body.event_date;
    const event_title = req.body.event_title;
    const event_captions = req.body.event_captions;
    const event_image = path.replaceAll('\\', '/');
    const event_type = req.body.event_type;

    try {

        const event = {
            admin_id: admin_id,
            church_id: church_id,
            event_date: event_date,
            event_title: event_title,
            event_captions: event_captions,
            event_image: event_image,
            event_type: event_type
        };

        const result = await Event.save(event);

        res.status(201).json({ message: 'event successfully created.'});
    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.deleteEvent = async (req, res, next) => {
    try {
        const deleteResponse = await Event.delete(req.params.id);
        res.status(200).json(deleteResponse);
        
    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}