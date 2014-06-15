package it.uniroma3.vi.model;

import java.util.List;

public class Transaction {

    private int idTr;

    private String hash;
    
    private List<Transaction> children;
    
    private List<Transaction> parents;
    
    public int getIdTr() {
	return idTr;
    }

    public void setIdTr(int id) {
	this.idTr = id;
    }

    public String getHash() {
	return hash;
    }

    public void setHash(String hash) {
	this.hash = hash;
    }

    public List<Transaction> getChildren() {
        return children;
    }

    public void setChildren(List<Transaction> children) {
        this.children = children;
    }

	public List<Transaction> getParents() {
		return parents;
	}

	public void setParents(List<Transaction> parents) {
		this.parents = parents;
	}

}
