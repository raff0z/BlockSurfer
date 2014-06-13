package it.uniroma3.vi.model.facade;

import it.uniroma3.vi.model.Transaction;

public interface TransactionFacade {
    Transaction findById(int id);
}
