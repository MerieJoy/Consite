const db = require('../util/database');

module.exports = class Church{
    constructor(church_id, church_name, church_contact, church_email, church_address, church_profile){
        this.church_id = church_id;
        this.church_name = church_name;
        this.church_contact = church_contact;
        this.church_email = church_email;
        this.church_address = church_address;
        this.church_profile = church_profile;
    }

    static fetchAll(){
        return db.execute('SELECT * FROM tbl_church');
    }

    static save(church){
        return db.execute(
            'INSERT INTO tbl_church (church_name, church_contact, church_email, church_address) VALUES(?, ?, ?, ?)',
            [church.church_name, church.church_contact, church.church_email, church.church_address]
        ).then( result => {
            return result[0].insertId;
        });
    }

    static update(church, church_id){
        return db.execute(
            'UPDATE tbl_church SET church_name = ?, church_profile = ?, church_contact = ?, church_email = ?, church_address = ? WHERE church_id = ?',
            [church.church_name, church.church_profile, church.church_contact, church.church_email, church.church_address, church_id]
        );
    }

    static getChurch(church_id){
        return db.execute(
            'SELECT * FROM tbl_church WHERE church_id = ?',
            [church_id]
        );
    }

    static findChurchByEmail(church_email, church_id){
        return db.execute(
            'SELECT * FROM tbl_church WHERE church_email = ? AND NOT church_id = ?',
            [church_email, church_id]
        );
    }

    static deleteChurch(church_id){
        return db.execute(
            'DELETE FROM tbl_church WHERE church_id = ?',
            [church_id]
        );
    }
};