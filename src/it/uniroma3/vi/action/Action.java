package it.uniroma3.vi.action;

import javax.servlet.http.HttpServletRequest;

public interface Action {
	
	public String execute(HttpServletRequest request);
	
}
