const db = require('../util/database');

module.exports = class Member{
    constructor(member_id, church_id, barcode, mem_profile, mem_fname, mem_mname, mem_lname, mem_suffix, mem_username, mem_password, mem_bday, mem_age, mem_sex, mem_cluster, mem_address, mem_email, mem_type){
        this.member_id = member_id;
        this.church_id = church_id;
        this.barcode = barcode;
        this.mem_profile = mem_profile;
        this.mem_fname = mem_fname;
        this.mem_mname = mem_mname;
        this.mem_lname = mem_lname;
        this.mem_suffix = mem_suffix;
        this.mem_username = mem_username;
        this.mem_password = mem_password;
        this.mem_bday = mem_bday;
        this.mem_age = mem_age;
        this.mem_sex = mem_sex;
        this.mem_cluster = mem_cluster;
        this.mem_address = mem_address;
        this.mem_email = mem_email;
        this.mem_type = mem_type;
    }

    static findUserame(mem_username){
        return db.execute(
            'SELECT * FROM tbl_member WHERE mem_username = ?',
            [mem_username]
        );
    }

    static getMember(member_id){
        return db.execute(
            'SELECT * FROM tbl_member mem INNER JOIN tbl_church ch ON mem.church_id = ch.church_id WHERE mem.member_id = ?',
            [member_id]
        );
    }

    static getMemberByName(church_id, name){
        return db.execute(
            'SELECT * FROM tbl_member mem INNER JOIN tbl_church ch ON mem.church_id = ch.church_id WHERE mem.mem_name = ? AND mem.church_id = ?',
            [name, church_id]
        );
    }

    static getMemberByBarcode(barcode){
        return db.execute(
            'SELECT * FROM tbl_member WHERE barcode = ?',
            [barcode]
        );
    }

    static fetchAll(){
        return db.execute(
            'SELECT * FROM tbl_member'
        );
    }

    static fetchInactive(mem_type, church_id, search, sexSearch){
        return db.execute(
            'SELECT * FROM tbl_member WHERE church_id = ? AND mem_type = ? AND (CONCAT(mem_fname, " ", mem_mname, ". ", mem_lname) LIKE ? OR mem_age LIKE ? OR mem_sex LIKE ? OR mem_address LIKE ? OR mem_cluster LIKE ? OR mem_type LIKE ?)',
            [church_id, mem_type, search, search, sexSearch, search, search, search]
        );
    }

    static fetchActive(mem_type, church_id, search, sexSearch){
        return db.execute(
            'SELECT * FROM tbl_member WHERE church_id = ? AND NOT mem_type = ? AND (CONCAT(mem_fname, " ", mem_mname, ". ", mem_lname) LIKE ? OR mem_age LIKE ? OR mem_sex LIKE ? OR mem_address LIKE ? OR mem_cluster LIKE ? OR mem_type LIKE ?)',
            [church_id, mem_type, search, search, sexSearch, search, search, search]
        );
    }

    static changePassword(new_password, mem_id){
        return db.execute(
            'UPDATE tbl_member set mem_password = ? WHERE member_id = ?',
            [new_password, mem_id]
        );
    }

    static findEmail(mem_email){
        return db.execute(
            'SELECT * FROM tbl_member WHERE mem_email = ?',
            [mem_email]
        );
    }

    static save(member){
        return db.execute(
            'INSERT INTO tbl_member (church_id, mem_fname, mem_mname, mem_lname, mem_username, mem_password, mem_bday, mem_age, mem_sex, mem_cluster, mem_address, mem_email, mem_type) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [member.church_id, member.mem_fname, member.mem_mname, member.mem_lname, member.mem_username, member.mem_password, member.mem_bday, member.mem_age, member.mem_sex, member.mem_cluster, member.mem_address, member.mem_email, member.mem_type]
        ).then( result => {
            return result[0].insertId;
        });
    }

    static updateSuffix(suffix, member_id){
        return db.execute(
            'UPDATE tbl_member SET mem_suffix = ? WHERE member_id = ?',
            [suffix, member_id]
        );
    }

    static update(member, member_id){
        return db.execute(
            'UPDATE tbl_member SET church_id = ?,mem_profile = ?, mem_fname = ?, mem_mname = ?, mem_lname = ?, mem_suffix = ?, mem_username = ?, mem_bday = ?, mem_age = ?, mem_sex = ?, mem_cluster = ?, mem_address = ?, mem_email = ?, mem_type = ? WHERE member_id = ?',
            [member.church_id, member.mem_profile, member.mem_fname, member.mem_mname, member.mem_lname, member.mem_suffix, member.mem_username, member.mem_bday, member.mem_age, member.mem_sex, member.mem_cluster, member.mem_address, member.mem_email, member.mem_type, member_id]
        );
    }

    static updateRegistration(barcode, member_id){
        return db.execute(
            'UPDATE tbl_member SET barcode = ? WHERE member_id = ?',
            [barcode, member_id]
        );
    }

    static findUserameExceptUser(mem_username, member_id){
        return db.execute(
            'SELECT * FROM tbl_member WHERE mem_username = ? AND NOT member_id = ?',
            [mem_username, member_id]
        );
    }

    static findEmailExceptUser(mem_email, member_id){
        return db.execute(
            'SELECT * FROM tbl_member WHERE mem_email = ? AND NOT member_id = ?',
            [mem_email, member_id]
        );
    }

    static setStatus(status, member_id){
        return db.execute(
            'UPDATE tbl_member SET mem_type = ? WHERE member_id = ?',
            [status, member_id]
        );
    }

    static deleteMember(church_id){
        return db.execute(
            'DELETE FROM tbl_member WHERE church_id = ?',
            [church_id]
        );
    }
};