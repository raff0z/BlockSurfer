package it.uniroma3.vi.persistence.repository;

import it.uniroma3.vi.helper.HelperBlock;
import it.uniroma3.vi.model.Block;
import it.uniroma3.vi.persistence.exception.PersistenceException;
import it.uniroma3.vi.persistence.jdbc.SimpleDataSourceBlocks;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class BlockRepositoryImpl implements BlockRepository {

    private SimpleDataSourceBlocks simpleDataSourceBlocks = new SimpleDataSourceBlocks();
    private HelperBlock helperBlock = new HelperBlock();

    public Block findById(int id) throws PersistenceException {
	Block block = null;
	Connection connection = simpleDataSourceBlocks.getConnection();
	PreparedStatement statement = null;
	String query = "SELECT * FROM block WHERE block_id=?";

	try {
	    statement = connection.prepareStatement(query);

	    statement.setInt(1, id);

	    ResultSet result = statement.executeQuery();

	    if (result.next()) {
		block = new Block();
		String hash = this.helperBlock.blobHashToString(result
			.getBlob("block_hash"));
		block.setHash(hash);
		block.setId(id);
	    }
	} catch (SQLException | IOException e) {

	    throw new PersistenceException(e.getMessage());
	} finally {
	    this.close(connection, statement);

	}
	return block;
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