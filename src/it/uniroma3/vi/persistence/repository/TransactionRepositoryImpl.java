package it.uniroma3.vi.persistence.repository;

import it.uniroma3.vi.helper.HelperTransaction;
import it.uniroma3.vi.model.Transaction;
import it.uniroma3.vi.persistence.exception.PersistenceException;
import it.uniroma3.vi.persistence.jdbc.SimpleDataSourceTransactions;

import java.io.IOException;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class TransactionRepositoryImpl implements TransactionRepository {

	private SimpleDataSourceTransactions simpleDataSourceTransactions = new SimpleDataSourceTransactions();
	private HelperTransaction helperTransaction = new HelperTransaction();

	/**
	 * Get all data of a transaction from the id
	 * @param id = the id of the transaction
	 * @return a transaction
	 */
	public Transaction findById(int id) throws PersistenceException {
		Transaction transaction = null;
		Connection connection = simpleDataSourceTransactions.getConnection();
		
		PreparedStatement statement = null;
		String query = "SELECT * FROM tx WHERE tx_id=?";

		try {
			statement = connection.prepareStatement(query);

			statement.setInt(1, id);

			ResultSet result = statement.executeQuery();

			if (result.next()) {
				transaction = new Transaction();
				String hash = this.helperTransaction.blobHashToString(result
						.getBlob("tx_hash"));
				
				transaction.setChildren(getChildren(id, connection));
						
				transaction.setParents(getParents(id, connection));
				
				transaction.setHash(hash);
				transaction.setIdTr(id);
			}
		} catch (SQLException | IOException e) {
			e.printStackTrace();
			throw new PersistenceException(e.getMessage());
		} finally {
			this.close(connection, statement);

		}
		return transaction;
	}

	private void close(Connection connection, PreparedStatement statement)
			throws PersistenceException {
		try {
			if (statement != null)
				statement.close();
			if (connection != null)
				connection.close();
		} catch (SQLException e) {
			throw new PersistenceException(e.getMessage());
		}
	}

	/**
	 * Get children of a transaction
	 * @param id = the id of the parent transaction
	 * @param connection = the connection to db 
	 * @return a list of children transactions
	 * @throws SQLException
	 * @throws IOException
	 */
	private List<Transaction> getChildren(int id, Connection connection) throws SQLException, IOException{
		List<Transaction> childrenTransaction = new ArrayList<Transaction>();

		PreparedStatement statement = null;

		String queryTxOuts = "SELECT txout.txout_pos, txout.txout_scriptPubKey, txout.txout_value, nexttx.tx_hash, nexttx.tx_id, pk.pubkey_hash,"
				+ "txin.txin_pos FROM txout LEFT JOIN txin ON (txin.txout_id = txout.txout_id) LEFT JOIN tx nexttx"
				+ " ON (txin.tx_id = nexttx.tx_id) LEFT JOIN pubkey pk on(txout.pubkey_id = pk.pubkey_id )"
				+ " WHERE txout.tx_id = ? ORDER BY txout.txout_pos";

		statement = connection.prepareStatement(queryTxOuts);

		statement.setInt(1, id);

		ResultSet result = statement.executeQuery();

		while (result.next()) {
		    
			Transaction transactionChild = new Transaction();

			Blob blob = result.getBlob("tx_hash");

			if (blob != null) {
				String hashChild = this.helperTransaction.blobHashToString(blob);
				Integer idChild = result.getInt("tx_id");
				transactionChild.setIdTr(idChild);
				transactionChild.setHash(hashChild);
				childrenTransaction.add(transactionChild);
			}
		}
		return childrenTransaction;
	}
	
	/**
	 * Get parents of a transaction
	 * @param id = the id of the child transaction
	 * @param connection = the connection to db 
	 * @return a list of parent transactions
	 * @throws SQLException
	 * @throws IOException
	 */
	private List<Transaction> getParents(int id, Connection connection) throws SQLException, IOException{
	    
		List<Transaction> parentsTransaction = new ArrayList<Transaction>();
		
		PreparedStatement statement = null;
		
		String queryTxIn = "SELECT u.txout_tx_hash, txin.txin_pos, txin.txin_scriptSig,txout.txout_value,prevtx.tx_id,"
			+ "COALESCE(prevtx.tx_hash, u.txout_tx_hash) as tx_hash,"
			+ "COALESCE(txout.txout_pos, u.txout_pos),txout.txout_scriptPubKey "
			+ "FROM txin LEFT JOIN txout ON (txout.txout_id = txin.txout_id) "
			+ "LEFT JOIN tx prevtx ON (txout.tx_id = prevtx.tx_id)"
			+ "LEFT JOIN unlinked_txin u ON (u.txin_id = txin.txin_id) "
			+ "WHERE txin.tx_id = ? ORDER BY txin.txin_pos";
			
		statement = connection.prepareStatement(queryTxIn);

		statement.setInt(1, id);

		ResultSet result = statement.executeQuery();
		
		while (result.next()) {
			Transaction transactionParent = new Transaction();
			
			
			Blob blob = result.getBlob("tx_hash");
			
			if (blob != null) {
				String hashParent = this.helperTransaction.blobHashToString(blob);
				
				Integer idParent = result.getInt("tx_id");
				transactionParent.setIdTr(idParent);
				transactionParent.setHash(hashParent);
				parentsTransaction.add(transactionParent);
			}
		}
		
		return parentsTransaction;

	}

}