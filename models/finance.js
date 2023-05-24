const db = require('../util/database');

module.exports = class Finance{
    constructor(finance_id, admin_id, total_offering, total_tithes, total_pledges, total_expenses, total_budget, cash_on_hand, finance_date){
        this.finance_id = finance_id;
        this.admin_id = admin_id;
        this.total_offering = total_offering;
        this.total_tithes = total_tithes;
        this.total_pledges = total_pledges;
        this.total_expenses = total_expenses;
        this.total_budget = total_budget;
        this.cash_on_hand = cash_on_hand;
        this.finance_date = finance_date;
    }

    static save(finance){
        return db.execute(
            'INSERT INTO tbl_finance (admin_id, total_offering, total_tithes, total_pledges, total_expenses, total_budget, cash_on_hand) VALUES(?, ?, ?, ?, ?, ?, ?)',
            [finance.admin_id, finance.total_offering, finance.total_tithes, finance.total_pledges, finance.total_expenses, finance.total_budget, finance.cash_on_hand]
        );
    }

    static getFinanceByDate(church_id, date){
        return db.execute(
            'SELECT  f.finance_date, f.cash_on_hand FROM tbl_finance f INNER JOIN tbl_admin a ON f.admin_id = a.admin_id WHERE a.church_id = ? AND f.finance_date LIKE ?',
            [church_id, date]
        );
    }

    static updateFinance(finance){
        return db.execute(
            'UPDATE tbl_finance SET total_offering = ?, total_tithes = ?, total_pledges = ?, total_expenses = ?, total_budget = ?, cash_on_hand = ? WHERE finance_id = ?',
            [finance.total_offering, finance.total_tithes, finance.total_pledges, finance.total_expenses, finance.total_budget, finance.cash_on_hand, finance.finance_id]
        )
    }

    static deleteFinance(church_id){
        return db.execute(
            'DELETE f FROM tbl_finance f INNER JOIN tbl_admin a ON f.admin_id = a.admin_id WHERE a.church_id = ?',
            [church_id]
        );
    }
};