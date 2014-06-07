package it.uniroma3.vi.action;

import it.uniroma3.vi.model.Block;
import it.uniroma3.vi.model.facade.BlockFacade;
import it.uniroma3.vi.model.facade.BlockFacadeImpl;

import javax.servlet.http.HttpServletRequest;

public class FindBlockAction implements Action {

    @Override
    public String execute(HttpServletRequest request) {

	BlockFacade blockFacade = new BlockFacadeImpl();

	int id = Integer.parseInt(request.getParameter("id"));

	Block block = blockFacade.findById(id);

	if (block != null) {
	    request.setAttribute("block", block);
	    return "block-info";
	} else {
	    request.setAttribute("error", "Error");
	    return "error";
	}

    }

}
