const db = require('../util/database');

module.exports = class Attendance{
    constructor(attendance_id, admin_id, member_id, attendance_date, attendance_time){
        this.attendance_id = attendance_id;
        this.admin_id = admin_id;
        this.member_id = member_id;
        this.attendance_date = attendance_date;
        this.attendance_time = attendance_time;
    }

    static fetchAllForByDate(date, church_id){
        return db.execute(
            'SELECT * FROM tbl_attendance a INNER JOIN tbl_member m ON a.member_id = m.member_id WHERE attendance_date = ? AND church_id = ? order by attendance_id DESC',
            [date, church_id]
        );
    }

    static alreadyAttended(id, date){
        return db.execute(
            'SELECT * FROM tbl_attendance WHERE member_id = ? AND attendance_date = ?',
            [id, date]
        )
    }

    static save(attendance){
        return db.execute(
            'INSERT INTO tbl_attendance (admin_id, member_id, attendance_date, attendance_time) VALUES(?, ?, ?, ?)',
            [attendance.admin_id, attendance.member_id, attendance.attendance_date, attendance.attendance_time]
        );
    }

    static countByDate(date, church_id){
        return db.execute(
            'SELECT m.mem_cluster, COUNT(*) as count FROM tbl_attendance a INNER JOIN tbl_member m ON a.member_id = m.member_id WHERE attendance_date = ? AND church_id = ? GROUP BY m.mem_cluster',
            [date, church_id]
        );
    }

    static countByChurch(church_id, month){
        return db.execute(
            'SELECT a.attendance_date, COUNT(*) as count FROM tbl_attendance a INNER JOIN tbl_member m ON a.member_id = m.member_id WHERE church_id = ? AND attendance_date LIKE ? GROUP BY a.attendance_date',
            [church_id, month]
        );
    }

    static getDemographics(date, church_id){
        return db.execute(
            'SELECT ad.church_id, a.attendance_date, COUNT(*) as attendance_count FROM tbl_attendance a INNER JOIN tbl_admin ad ON a.admin_id = ad.admin_id WHERE attendance_date LIKE ? AND church_id = ? GROUP BY a.attendance_date ORDER BY a.attendance_date ASC',
            [date, church_id]
        );
    }

    static deleteAtendance(church_id){
        return db.execute(
            'DELETE a FROM tbl_attendance a INNER JOIN tbl_member m ON a.member_id = m.member_id WHERE m.church_id = ?',
            [church_id]
        );
    }
};