const db = require('../util/database');

module.exports = class Offering{
    constructor(offering_id, admin_id, offering_amount, offering_date){
        this.offering_id = offering_id;
        this.admin_id = admin_id;
        this.offering_amount = offering_amount;
        this.offering_date = offering_date;
    }

    static save(offering){
        return db.execute(
            'INSERT INTO tbl_offering (admin_id, offering_amount, offering_date) VALUES(?, ?, ?)',
            [offering.admin_id, offering.offering_amount, offering.offering_date]
        );
    }

    static getTotalOfferings(admin_id, offering_date){
        return db.execute(
            'SELECT SUM(offering_amount) as offering_amount FROM tbl_offering WHERE admin_id = ? AND offering_date = ?',
            [admin_id, offering_date]
        );
    }

    static getAllOfferingsByDate(admin_id, offering_date){
        return db.execute(
            'SELECT * FROM tbl_offering WHERE admin_id = ? AND offering_date = ?',
            [admin_id, offering_date]
        )
    }

    static deleteOfferings(church_id){
        return db.execute(
            'DELETE o FROM tbl_offering o INNER JOIN tbl_admin a ON o.admin_id = a.admin_id WHERE a.church_id = ?',
            [church_id]
        );
    }
};