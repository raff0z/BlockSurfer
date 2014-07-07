package it.uniroma3.vi.model;

import java.util.Date;
import java.util.List;

public class Transaction {

    private int id;

    private String hash;
    
    private List<Transaction> children;
    
    private List<Transaction> parents;
    
    private Date date;
    
    private double amount;
    
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

	public Date getDate() {
	    return date;
	}

	public void setDate(Date date) {
	    this.date = date;
	}

	public double getAmount() {
	    return amount;
	}

	public void setAmount(double amount) {
	    this.amount = amount;
	}

}
