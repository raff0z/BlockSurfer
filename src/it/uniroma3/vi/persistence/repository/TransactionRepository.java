package it.uniroma3.vi.persistence.repository;

import it.uniroma3.vi.model.Transaction;
import it.uniroma3.vi.persistence.exception.PersistenceException;

public interface TransactionRepository {

    Transaction findById(int id) throws PersistenceException;
}
