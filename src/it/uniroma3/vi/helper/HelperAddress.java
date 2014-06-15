package it.uniroma3.vi.helper;

import java.io.IOException;
import java.sql.Blob;
import java.sql.SQLException;

import com.google.bitcoin.core.Base58;
import com.google.bitcoin.core.Utils;

public class HelperAddress {

    /**
     * give an address from an hash160 implementation of
     * https://en.bitcoin.it/wiki/Technical_background_of_version_1_Bitcoin_addresses
     **/
    public String blobHashToAddressString(Blob blob, String version)
	    throws SQLException, IOException {

	byte[] bytedHash = blob.getBytes(1, (int) blob.length());

	HelperCommon hc = new HelperCommon();

	byte[] bytedVersion = hc.hexStringToByteArray(version);

	byte[] bytedHashWVersion = getBytedHashWVersion(bytedHash, bytedVersion);

	byte[] encryptedBytedHashWVersion = Utils
		.doubleDigest(bytedHashWVersion);

	byte[] completeEncryptedBytedHashWVersion = getCompleteEncryptedBytedHashWVersion(encryptedBytedHashWVersion, bytedHashWVersion);

	String address = Base58.encode(completeEncryptedBytedHashWVersion);

	return address;
    }

    private byte[] getBytedHashWVersion(byte[] bytedHash, byte[] bytedVersion) {
	byte[] bytedHashWVersion = new byte[bytedHash.length
		+ bytedVersion.length];

	for (int i = 0; i < bytedHashWVersion.length; i++) {
	    if (bytedVersion.length - i > 0) {
		bytedHashWVersion[i] = bytedVersion[i];
	    } else {
		bytedHashWVersion[i] = bytedHash[i - bytedVersion.length];
	    }
	}

	return bytedHashWVersion;
    }

    private byte[] getCompleteEncryptedBytedHashWVersion(
	    byte[] encryptedBytedHashWVersion, byte[] bytedHashWVersion) {
	byte[] completeEncryptedBytedHashWVersion = new byte[bytedHashWVersion.length + 4];

	int cEBHLength = completeEncryptedBytedHashWVersion.length;

	completeEncryptedBytedHashWVersion[cEBHLength - 1] = encryptedBytedHashWVersion[3];
	completeEncryptedBytedHashWVersion[cEBHLength - 2] = encryptedBytedHashWVersion[2];
	completeEncryptedBytedHashWVersion[cEBHLength - 3] = encryptedBytedHashWVersion[1];
	completeEncryptedBytedHashWVersion[cEBHLength - 4] = encryptedBytedHashWVersion[0];

	for (int i = 0; i < bytedHashWVersion.length; i++) {
	    completeEncryptedBytedHashWVersion[i] = bytedHashWVersion[i];
	}

	return completeEncryptedBytedHashWVersion;
    }

}
