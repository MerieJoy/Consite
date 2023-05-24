const db = require('../util/database');

module.exports = class Admin{
    constructor(admin_id, church_id, admin_username, admin_password, admin_type){
        this.admin_id = admin_id;
        this.church_id = church_id;
        this.admin_username = admin_username;
        this.admin_password = admin_password;
        this.admin_type = admin_type;
    }

    static fetchAll(){
        return db.execute('SELECT * FROM tbl_admin');
    }

    static save(admin){
        return db.execute(
            'INSERT INTO tbl_admin (church_id, admin_username, admin_password, admin_type) VALUES(?, ?, ?, ?)',
            [admin.church_id, admin.admin_username, admin.admin_password, admin.admin_type]
        );
    }

    static update(admin, admin_id){
        return db.execute(
            'UPDATE tbl_admin SET admin_username = ?, admin_type = ? WHERE admin_id = ?',
            [admin.admin_username, admin.admin_type, admin_id]
        );
    }

    static changePassword(new_password, admin_id){
        return db.execute(
            'UPDATE tbl_admin SET admin_password = ? WHERE admin_id = ?',
            [new_password, admin_id]
        );
    }

    static findUserame(admin_username, admin_id){
        return db.execute(
            'SELECT * FROM tbl_admin WHERE admin_username = ? AND NOT admin_id = ?',
            [admin_username, admin_id]
        );
    }

    static findByUserame(admin_username){
        return db.execute(
            'SELECT * FROM tbl_admin WHERE admin_username = ?',
            [admin_username]
        );
    }

    static getAdmin(admin_id){
        return db.execute(
            'SELECT * FROM tbl_admin ad INNER JOIN tbl_church ch ON ad.church_id = ch.church_id WHERE ad.admin_id = ?',
            [admin_id]
        );
    }

    static getAdminByChurch(church_id, username){
        return db.execute(
            'SELECT * FROM tbl_admin WHERE church_id = ? AND NOT admin_username = ?',
            [church_id, username]
        );
    }

    static deleteAdmin(church_id){
        return db.execute(
            'DELETE FROM tbl_admin WHERE church_id = ?',
            [church_id]
        );
    }
};