const db = require('../util/database');

module.exports = class Pledge{
    constructor(pledge_id, admin_id, member_id, pledge_purpose, pledge_amount, pledge_date){
        this.pledge_id = pledge_id;
        this.admin_id = admin_id;
        this.member_id = member_id;
        this.pledge_purpose = pledge_purpose;
        this.pledge_amount = pledge_amount;
        this.pledge_date = pledge_date;
    }

    static save(pledge){
        return db.execute(
            'INSERT INTO tbl_pledges (admin_id, member_id, pledge_purpose, pledge_amount) VALUES(?, ?, ?, ?)',
            [pledge.admin_id, pledge.member_id, pledge.pledge_purpose, pledge.pledge_amount]
        );
    }

    static getTotalPledges(admin_id, date){
        return db.execute(
            'SELECT SUM(pledge_amount) as pledge_amount FROM tbl_pledges WHERE admin_id = ? AND pledge_date = ?',
            [admin_id, date]
        );
    }

    static getAllPledgesByDate(admin_id, pledge_date){
        return db.execute(
            'SELECT * FROM tbl_pledges p INNER JOIN tbl_member m ON p.member_id = m.member_id WHERE p.admin_id = ? AND pledge_date = ?',
            [admin_id, pledge_date]
        )
    }

    static deletePledges(church_id){
        return db.execute(
            'DELETE p FROM tbl_pledges p INNER JOIN tbl_member m ON p.member_id = m.member_id WHERE m.church_id = ?',
            [church_id]
        );
    }
};