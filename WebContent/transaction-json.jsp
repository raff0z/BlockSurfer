<%@ page language="java" contentType="application/json; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
String transactionJson = (String) request.getAttribute("transactionJson");
	out.print(transactionJson);
	out.flush();
%>