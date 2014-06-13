<%@page import="it.uniroma3.vi.model.Block"%>
<%@page import="java.util.*"%>

<!DOCTYPE html>
<html>
	<head>
	
		<link href="css/style.css" rel="stylesheet" type="text/css">
		
		<% Block block = (Block) request.getAttribute("block"); %>
		<title>Blocco: <%out.print(block.getId()); %></title>
		
		<script src="js/d3.min.js" charset="utf-8"></script>
	
	</head>
	
	<body>
		<h1>Blocco: <%out.print(block.getId()); %></h1>
		<p>
			Hash: <%out.print(block.getHash()); %>
		</p>
		
		<script src="js/visualization.js"></script>
		<script type="text/javascript">
			init(<%out.print(block.getId());%>);
		</script>
	</body>
</html>