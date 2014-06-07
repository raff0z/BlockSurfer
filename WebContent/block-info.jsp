<%@page import="it.uniroma3.vi.model.Block"%>
<%@page import="java.util.*"%>

<!DOCTYPE html>
<html>
<head>
<% Block block = (Block) request.getAttribute("block"); %>
<title>Blocco: <%out.print(block.getId()); %></title>
</head>
<body>
	<h1>Blocco: <%out.print(block.getId()); %></h1>
	<p>
		Hash: <%out.print(block.getHash()); %>
	</p>
</body>
</html>