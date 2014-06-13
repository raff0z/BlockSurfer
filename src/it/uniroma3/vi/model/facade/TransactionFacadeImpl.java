package it.uniroma3.vi.model.facade;

import it.uniroma3.vi.model.Transaction;
import it.uniroma3.vi.persistence.exception.PersistenceException;
import it.uniroma3.vi.persistence.repository.TransactionRepository;
import it.uniroma3.vi.persistence.repository.TransactionRepositoryImpl;

public class TransactionFacadeImpl implements TransactionFacade {

    private TransactionRepository repository = new TransactionRepositoryImpl();

    public Transaction findById(int id) {
	Transaction transaction = null;

	try {
	    transaction = repository.findById(id);
	} catch (PersistenceException e) {
	    return null;
	}

	return transaction;
    }
}