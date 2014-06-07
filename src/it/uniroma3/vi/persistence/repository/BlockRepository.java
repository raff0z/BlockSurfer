package it.uniroma3.vi.persistence.repository;

import it.uniroma3.vi.model.Block;
import it.uniroma3.vi.persistence.exception.PersistenceException;

public interface BlockRepository {

    Block findById(int id) throws PersistenceException;
}
