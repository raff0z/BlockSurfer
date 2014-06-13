<%@ page language="java" contentType="application/json; charset=UTF-8"
	pageEncoding="UTF-8"
%>
<%
String blockJson = (String) request.getAttribute("blockJson");
	out.print(blockJson);
	out.flush();
%>