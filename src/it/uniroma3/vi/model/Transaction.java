package it.uniroma3.vi.model;

import java.util.Date;
import java.util.List;
import java.util.Map;

public class Transaction {
    private int id;
    private String hash;
    private List<Transaction> children;
    private List<Transaction> parents;
    private Date date;
    private double totalIn;
    private double totalOut;
    private List<String> toAddress;
    private List<String> fromAddress;
    private boolean notYetRedeemed;
    private Map<Integer, Float> fromAddress2Values;
    private Map<Integer, Float> toAddress2Values;
    
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

    public boolean isNotYetRedeemed() {
	return notYetRedeemed;
    }

    public void setNotYetRedeemed(boolean notYetRedeemed) {
	this.notYetRedeemed = notYetRedeemed;
    }

    public List<String> getToAddress() {
	return toAddress;
    }

    public void setToAddress(List<String> toAddress) {
	this.toAddress = toAddress;
    }

    public List<String> getFromAddress() {
	return fromAddress;
    }

    public void setFromAddress(List<String> fromAddress) {
	this.fromAddress = fromAddress;
    }

    public Map<Integer, Float> getFromAddress2Values() {
        return fromAddress2Values;
    }

    public void setFromAddress2Values(Map<Integer, Float> fromAddress2Values) {
        this.fromAddress2Values = fromAddress2Values;
    }

    public Map<Integer, Float> getToAddress2Values() {
        return toAddress2Values;
    }

    public void setToAddress2Values(Map<Integer, Float> toAddress2Values) {
        this.toAddress2Values = toAddress2Values;
    }

    public double getTotalIn() {
        return totalIn;
    }

    public void setTotalIn(double totalIn) {
        this.totalIn = totalIn;
    }

    public double getTotalOut() {
        return totalOut;
    }

    public void setTotalOut(double totalOut) {
        this.totalOut = totalOut;
    }

}
