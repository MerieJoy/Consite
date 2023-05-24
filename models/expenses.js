const db = require('../util/database');

module.exports = class Expenses{
    constructor(expenses_id, admin_id, expenses_purpose, expenses_amount, expenses_date){
        this.expenses_id = expenses_id;
        this.admin_id = admin_id;
        this.expenses_purpose = expenses_purpose;
        this.expenses_amount = expenses_amount;
        this.expenses_date = expenses_date;
    }

    static save(expenses){
        return db.execute(
            'INSERT INTO tbl_expenses (admin_id, expenses_purpose, expenses_amount) VALUES(?, ?, ?)',
            [expenses.admin_id, expenses.expenses_purpose, expenses.expenses_amount]
        );
    }

    static getTotalExpenses(admin_id, date){
        return db.execute(
            'SELECT SUM(expenses_amount) as expenses_amount FROM tbl_expenses WHERE admin_id = ? AND expenses_date = ?',
            [admin_id, date]
        );
    }

    static getAllExpensesByDate(admin_id, expenses_date){
        return db.execute(
            'SELECT * FROM tbl_expenses WHERE admin_id = ? AND expenses_date = ?',
            [admin_id, expenses_date]
        )
    }

    static deleteExpenses(church_id){
        return db.execute(
            'DELETE e FROM tbl_expenses e INNER JOIN tbl_admin a ON e.admin_id = a.admin_id WHERE a.church_id = ?',
            [church_id]
        );
    }
};