package it.uniroma3.vi.model;

import java.util.List;

public class Block {

    private int id;

    private String hash;
    
    private List<Block> output;

    public int getId() {
	return id;
    }

    public void setId(int id) {
	this.id = id;
    }

    public String getHash() {
	return hash;
    }

    public void setHash(String hash) {
	this.hash = hash;
    }

    public List<Block> getOutput() {
        return output;
    }

    public void setOutput(List<Block> output) {
        this.output = output;
    }

}
