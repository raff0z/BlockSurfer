package it.uniroma3.vi.controller;

import it.uniroma3.vi.action.Action;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


public class Controller extends HttpServlet {
	private static final long serialVersionUID = 1L;

	private Map<String, String> comand2action;
	private Map<String, String> output2page;

	//inizializzatore della classe
	public void init() {
		this.comand2action = new HashMap<String, String>();
		this.output2page = new HashMap<String, String>();
		
		//TODO
	}
	
	//nel nostro caso svolgono la stessa funzione
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request,response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)	throws ServletException, IOException {
		String nextPage = null;
		String command = this.readCommand(request.getServletPath());
		String actionName = this.comand2action.get(command); //Preso dinamicamente il tipo di comando, prelevo tramite il mapping l'azione associata
		
		if (actionName==null) {
			nextPage = "/error.jsp";
		}

		else {
			//Se non è null provo a creare dinamicamente il tipo di azione associata
			Action action = null;
			try {
				//La creazione di azione necessita del parametro HettpServletRequest, lo imposto prelevando il costruttore dalla classe azione e
				//passando request come parametro effettivo
				actionName = "it.uniroma3.vi."+actionName;
				action = (Action)Class.forName(actionName).newInstance();
				//costruita l'azione, la eseguo
				String output = action.execute(request);
				//e prelevo la pagina corrispondente all'esito
				nextPage = this.output2page.get(output);
			} 
			catch (InstantiationException e) {
				e.printStackTrace();
				nextPage = "/error.jsp";
			} 
			catch (IllegalAccessException e) {
				e.printStackTrace();
				nextPage = "/error.jsp";
			} 
			catch (ClassNotFoundException e) {
				e.printStackTrace();
				nextPage = "/error.jsp";
			}
		}
		ServletContext application = getServletContext();
		RequestDispatcher rd = application.getRequestDispatcher(nextPage);
		rd.forward(request, response);
	}

	//Metodo che estrae il comando a partire dall'url
	private String readCommand(String servletPath) {
		//il metodo split separa la stringa in n stringhe (che riporta in un array) secondo una espressione regolare
		String[] path = servletPath.split("/"); //separo l'url cosi da poter prendere l'ultima stringa dopo /
		
		String command = path[path.length-1].split("\\.")[0]; //prendo l'ultima stringa del percorso e la separo con il .do
		return command;
	}


}

