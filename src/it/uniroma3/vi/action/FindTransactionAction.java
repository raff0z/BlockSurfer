package it.uniroma3.vi.action;

import it.uniroma3.vi.model.Transaction;
import it.uniroma3.vi.model.facade.TransactionFacade;
import it.uniroma3.vi.model.facade.TransactionFacadeImpl;

import javax.servlet.http.HttpServletRequest;

public class FindTransactionAction implements Action {

    @Override
    public String execute(HttpServletRequest request) {

	TransactionFacade transactionFacade = new TransactionFacadeImpl();

	int id = Integer.parseInt(request.getParameter("id"));

	Transaction transaction = transactionFacade.findById(id);

	if (transaction != null) {
	    request.setAttribute("transaction", transaction);
	    return "transaction-info";
	} else {
	    request.setAttribute("error", "Error");
	    return "error";
	}

    }

}
