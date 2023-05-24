const db = require('../util/database');

module.exports = class Tithes{
    constructor(tithes_id, admin_id, member_id, tithes_amount, tithes_date){
        this.tithes_id = tithes_id;
        this.admin_id = admin_id;
        this.member_id = member_id;
        this.tithes_amount = tithes_amount;
        this.tithes_date = tithes_date;
    }

    static save(tithes){
        return db.execute(
            'INSERT INTO tbl_tithes (admin_id, member_id, tithes_amount, tithes_date) VALUES(?, ?, ?, ?)',
            [tithes.admin_id, tithes.member_id, tithes.tithes_amount, tithes.tithes_date]
        );
    }

    static getTotalTithes(admin_id, date){
        return db.execute(
            'SELECT SUM(tithes_amount) as tithes_amount FROM tbl_tithes WHERE admin_id = ? AND tithes_date = ?',
            [admin_id, date]
        );
    }

    static getAllTithesByDate(admin_id, tithes_date){
        return db.execute(
            'SELECT * FROM tbl_tithes t INNER JOIN tbl_member m ON t.member_id = m.member_id WHERE t.admin_id = ? AND tithes_date = ?',
            [admin_id, tithes_date]
        )
    }

    static deleteTithes(church_id){
        return db.execute(
            'DELETE t FROM tbl_tithes t INNER JOIN tbl_member m ON t.member_id = m.member_id WHERE m.church_id = ?',
            [church_id]
        );
    }
};