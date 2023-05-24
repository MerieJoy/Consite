const db = require('../util/database');

module.exports = class Baptismal{
    constructor(baptismal_id, member_id, baptismal_date, candidate_name, candidate_bday, candidate_age, candidate_bplace, candidate_sex, candidate_mother, candidate_father, candidate_status){
        this.baptismal_id = baptismal_id;
        this.member_id = member_id;
        this.baptismal_date = baptismal_date;
        this.candidate_name = candidate_name;
        this.candidate_bday = candidate_bday;
        this.candidate_age = candidate_age;
        this.candidate_bplace = candidate_bplace;
        this.candidate_sex = candidate_sex;
        this.candidate_mother = candidate_mother;
        this.candidate_father = candidate_father;
        this.candidate_status = candidate_status;
    }

    static fetchAll(){
        return db.execute('SELECT * FROM tbl_baptismal b INNER JOIN tbl_member m ON b.member_id = m.member_id');
    }

    static save(baptismal){
        return db.execute(
            'INSERT INTO tbl_baptismal (member_id, baptismal_date, candidate_name, candidate_bday, candidate_age, candidate_bplace, candidate_sex, candidate_mother, candidate_father, candidate_status) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [baptismal.member_id, baptismal.baptismal_date, baptismal.candidate_name, baptismal.candidate_bday, baptismal.candidate_age, baptismal.candidate_bplace, baptismal.candidate_sex, baptismal.candidate_mother, baptismal.candidate_father, baptismal.candidate_status]
        );
    }

    static fetchAllByMemberId(member_id){
        return db.execute(
            'SELECT * FROM tbl_baptismal WHERE member_id = ? ORDER BY baptismal_id DESC',
            [member_id]
        );
    }

    static fetchById(baptismal_id){
        return db.execute(
            'SELECT * FROM tbl_baptismal b INNER JOIN tbl_member m ON b.member_id = m.member_id WHERE baptismal_id = ?',
            [baptismal_id]
        );
    }

    static approveRequest(baptismal_id){
        return db.execute(
            'UPDATE tbl_baptismal SET candidate_status = "Approved" WHERE baptismal_id = ?',
            [baptismal_id]
        );
    }

    static reschedBaptismal(reschedDate, baptismal_id){
        return db.execute(
            'UPDATE tbl_baptismal SET baptismal_date = ?, candidate_status = "Rescheduled" WHERE baptismal_id = ?',
            [reschedDate, baptismal_id]
        );
    }

    static deleteBaptismal(church_id){
        return db.execute(
            'DELETE b FROM tbl_baptismal b INNER JOIN tbl_member m ON m.member_id = b.member_id WHERE m.church_id = ?',
            [church_id]
        );
    }
};