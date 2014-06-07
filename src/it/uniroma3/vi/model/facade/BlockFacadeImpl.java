package it.uniroma3.vi.model.facade;

import it.uniroma3.vi.model.Block;
import it.uniroma3.vi.persistence.exception.PersistenceException;
import it.uniroma3.vi.persistence.repository.BlockRepository;
import it.uniroma3.vi.persistence.repository.BlockRepositoryImpl;

public class BlockFacadeImpl implements BlockFacade {

    private BlockRepository repository = new BlockRepositoryImpl();

    public Block findById(int id) {
	Block block = null;

	try {
	    block = repository.findById(id);
	} catch (PersistenceException e) {
	    return null;
	}

	return block;
    }
}