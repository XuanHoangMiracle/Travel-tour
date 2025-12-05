import pool from '../configs/postgresql.js';

class TransactionService {
  static async create(transactionData) {
    const {
      booking_id, user_id, vnp_txn_ref, amount,
      status = 'pending', payment_method = 'vnpay', vnp_order_info
    } = transactionData;

    const query = `
      INSERT INTO transactions (
        booking_id, user_id, vnp_txn_ref, amount, status, 
        payment_method, vnp_order_info, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *
    `;

    const values = [booking_id, user_id, vnp_txn_ref, amount, status, payment_method, vnp_order_info];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('TransactionService.create error:', error);
      throw error;
    }
  }

  static async getByBookingId(bookingId) {
    const query = `SELECT * FROM transactions WHERE booking_id = $1 ORDER BY created_at DESC LIMIT 1`;
    try {
      const result = await pool.query(query, [bookingId]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('TransactionService.getByBookingId error:', error);
      throw error;
    }
  }

  static async getByUserId(userId) {
    const query = `SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC`;
    try {
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error('TransactionService.getByUserId error:', error);
      throw error;
    }
  }

  static async update(bookingId, updateData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach(key => {
      fields.push(`${key} = $${paramCount}`);
      values.push(updateData[key]);
      paramCount++;
    });

    fields.push(`updated_at = NOW()`);
    values.push(bookingId);

    const query = `UPDATE transactions SET ${fields.join(', ')} WHERE booking_id = $${paramCount} RETURNING *`;

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('TransactionService.update error:', error);
      throw error;
    }
  }

  static async getByTxnRef(vnpTxnRef) {
    const query = `SELECT * FROM transactions WHERE vnp_txn_ref = $1 LIMIT 1`;
    try {
      const result = await pool.query(query, [vnpTxnRef]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('TransactionService.getByTxnRef error:', error);
      throw error;
    }
  }

  static async getAll(limit = 100, offset = 0) {
    const query = `SELECT * FROM transactions ORDER BY created_at DESC LIMIT $1 OFFSET $2`;
    try {
      const result = await pool.query(query, [limit, offset]);
      return result.rows;
    } catch (error) {
      console.error('TransactionService.getAll error:', error);
      throw error;
    }
  }

  static async getStatistics() {
    const query = `
      SELECT 
        COUNT(*) as total_transactions,
        SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as successful_transactions,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_transactions,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_transactions,
        SUM(CASE WHEN status = 'success' THEN amount ELSE 0 END) as total_revenue
      FROM transactions
    `;
    try {
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      console.error('TransactionService.getStatistics error:', error);
      throw error;
    }
  }
}

export default TransactionService;
