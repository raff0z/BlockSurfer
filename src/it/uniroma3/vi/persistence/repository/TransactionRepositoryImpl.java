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

    public Transaction findById(int id) throws PersistenceException {
	Transaction transaction = null;
	Connection connection = simpleDataSourceTransactions.getConnection();
	PreparedStatement statement = null;
	String query = "SELECT * FROM tx WHERE tx_id=?";

	try {
	    statement = connection.prepareStatement(query);

	    statement.setInt(1, id);

	    ResultSet result = statement.executeQuery();

	    List<Transaction> childrenTransaction = new ArrayList<Transaction>();

	    if (result.next()) {
		transaction = new Transaction();
		String hash = this.helperTransaction.blobHashToString(result
			.getBlob("tx_hash"));

		PreparedStatement statementTwo = null;

		String queryTx = "SELECT txout.txout_pos, txout.txout_scriptPubKey, txout.txout_value, nexttx.tx_hash, nexttx.tx_id, pk.pubkey_hash,"
			+ "txin.txin_pos FROM txout LEFT JOIN txin ON (txin.txout_id = txout.txout_id) LEFT JOIN tx nexttx"
			+ " ON (txin.tx_id = nexttx.tx_id) LEFT JOIN pubkey pk on(txout.pubkey_id = pk.pubkey_id )"
			+ " WHERE txout.tx_id = ? ORDER BY txout.txout_pos";

		statementTwo = connection.prepareStatement(queryTx);

		statementTwo.setInt(1, id);

		ResultSet resultTwo = statementTwo.executeQuery();

		while (resultTwo.next()) {
		    Transaction transactionChild = new Transaction();

		    Blob blob = resultTwo.getBlob("tx_hash");

		    if (blob != null) {
			String hashChild = this.helperTransaction
				.blobHashToString(blob);
			Integer idChild = resultTwo.getInt("tx_id");
			transactionChild.setIdTr(idChild);
			transactionChild.setHash(hashChild);
			childrenTransaction.add(transactionChild);
		    }
		}

		transaction.setChildren(childrenTransaction);
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

}