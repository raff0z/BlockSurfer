package it.uniroma3.vi.action;

import it.uniroma3.vi.model.Block;
import it.uniroma3.vi.model.facade.BlockFacade;
import it.uniroma3.vi.model.facade.BlockFacadeImpl;

import javax.servlet.http.HttpServletRequest;

import com.google.gson.Gson;

public class JsonBlockAction implements Action {

    @Override
    public String execute(HttpServletRequest request) {

	BlockFacade blockFacade = new BlockFacadeImpl();

	int id = Integer.parseInt(request.getParameter("id"));

	Block block = blockFacade.findById(id);
	Gson gson = new Gson();
	String blockJson = gson.toJson(block);
	
	if (blockJson != null) {
	    request.setAttribute("blockJson", blockJson);
	    return "block-json";
	} else {
	    request.setAttribute("error", "Error");
	    return "error";
	}

    }

}
