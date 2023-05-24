const db = require('../util/database');

module.exports = class Event{
    constructor(event_id, admin_id, church_id, event_date, event_title, event_captions, event_image, event_type){
        this.event_id = event_id;
        this.admin_id = admin_id;
        this.church_id = church_id;
        this.event_date = event_date;
        this.event_title = event_title;
        this.event_captions = event_captions;
        this.event_image = event_image;
        this.event_type = event_type;
    }

    static fetchAll(){
        return db.execute('SELECT * FROM tbl_event evt INNER JOIN tbl_church ch ON evt.church_id = ch.church_id order by event_date DESC');
    }

    static save(event){
        return db.execute(
            'INSERT INTO tbl_event (admin_id, church_id, event_date, event_title, event_captions, event_image, event_type) VALUES(?, ?, ?, ?, ?, ?, ?)',
            [event.admin_id, event.church_id, event.event_date, event.event_title, event.event_captions, event.event_image, event.event_type]
        );
    }

    static deleteEvent(church_id){
        return db.execute(
            'DELETE FROM tbl_event WHERE church_id = ?',
            [church_id]
        );
    }
};