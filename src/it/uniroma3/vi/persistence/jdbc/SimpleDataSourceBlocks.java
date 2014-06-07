package it.uniroma3.vi.persistence.jdbc;

import java.beans.PropertyVetoException;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Properties;
import java.util.logging.Logger;

import com.mchange.v2.c3p0.ComboPooledDataSource;

public class SimpleDataSourceBlocks {

    private static Logger logger = Logger
	    .getLogger("it.uniroma3.persistence.vi.jdbc.SimpleDataSourceBlocks");
    private ComboPooledDataSource cpds;
    private static SimpleDataSourceBlocks instance;

    public SimpleDataSourceBlocks() {
	InputStream inputStream = null;
	Properties conf = new Properties();

	try {
	    inputStream = this.getClass().getClassLoader()
		    .getResourceAsStream("db.properties");
	    conf.load(inputStream);
	} catch (IOException e) {
	    logger.severe("Error loading the Data Source property file: "
		    + e.getMessage());
	}
	String uri = conf.getProperty("db-uri");
	String password = conf.getProperty("db-password");
	String username = conf.getProperty("db-user");
	String driver = conf.getProperty("db-driver");

	this.cpds = new ComboPooledDataSource();
	try {
	    cpds.setDriverClass(driver);
	} catch (PropertyVetoException e) {
	    logger.severe("Error Loading Class Driver " + e.getMessage());
	}
	this.cpds.setJdbcUrl(uri);
	this.cpds.setUser(username);
	this.cpds.setPassword(password);

	cpds.setMinPoolSize(5);
	cpds.setAcquireIncrement(5);
	cpds.setMaxPoolSize(20);
    }

    public static SimpleDataSourceBlocks getInstance() {
	if (instance == null)
	    instance = new SimpleDataSourceBlocks();
	return instance;
    }

    public Connection getConnection() {
	Connection connection = null;
	try {
	    connection = cpds.getConnection();
	} catch (SQLException e) {
	    logger.severe("Connection not created " + e.getMessage());
	}
	return connection;
    }
}