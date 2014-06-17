<%@page import="it.uniroma3.vi.model.Transaction"%>
<%@page import="java.util.*"%>

<!DOCTYPE html>
<html>
	<head>
	
		<link href="css/graph-style.css" rel="stylesheet" type="text/css">
		
		<% Transaction transaction = (Transaction) request.getAttribute("transaction"); %>
		<title>Transazione: <%
		    out.print(transaction.getIdTr());
		%></title>
		
		<script src="js/d3.js" charset="utf-8"></script>
	
	</head>
	
	<body>
		<h1>Transazione: <%
		    out.print(transaction.getIdTr());
		%></h1>
		<p>
			Hash: <%
		    out.print(transaction.getHash());
		%>
		</p>
		
		<script src="js/graph-visualization.js"></script>
		<script type="text/javascript">
			addNode(<%out.print(transaction.getIdTr());%>);
		</script>
	</body>
</html>