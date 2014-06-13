package it.uniroma3.vi.action;

import it.uniroma3.vi.model.Transaction;
import it.uniroma3.vi.model.facade.TransactionFacade;
import it.uniroma3.vi.model.facade.TransactionFacadeImpl;

import javax.servlet.http.HttpServletRequest;

import com.google.gson.Gson;

public class JsonTransactionAction implements Action {

    @Override
    public String execute(HttpServletRequest request) {

	TransactionFacade transactionFacade = new TransactionFacadeImpl();

	int id = Integer.parseInt(request.getParameter("id"));

	Transaction transaction = transactionFacade.findById(id);
	Gson gson = new Gson();
	String transactionJson = gson.toJson(transaction);
	
	if (transactionJson != null) {
	    request.setAttribute("transactionJson", transactionJson);
	    return "transaction-json";
	} else {
	    request.setAttribute("error", "Error");
	    return "error";
	}

    }

}
