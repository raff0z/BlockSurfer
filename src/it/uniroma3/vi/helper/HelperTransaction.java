package it.uniroma3.vi.helper;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Blob;
import java.sql.SQLException;

public class HelperTransaction {

    public String blobHashToString(Blob blob) throws SQLException, IOException {

	String hash = "";

	InputStream is = blob.getBinaryStream();

	int ch;
	while ((ch = is.read()) != -1) {
	    String part = Integer.toHexString(ch);
	    if (part.length() == 1)
		hash += "0" + part;
	    else
		hash += part;
	}
	return hash;
    }

}
