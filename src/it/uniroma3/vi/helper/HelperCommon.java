package it.uniroma3.vi.helper;

public class HelperCommon {

    /**
     * Convert an hex string into a byte array
     * 
     * @param hexString
     * @return byte[] of hexString
     */
    public byte[] hexStringToByteArray(String hexString) {
	int length = hexString.length();
	byte[] data = new byte[length / 2];
	for (int i = 0; i < length; i += 2) {
	    data[i / 2] = (byte) ((Character.digit(hexString.charAt(i), 16) << 4) + Character
		    .digit(hexString.charAt(i + 1), 16));
	}
	return data;
    }

}
