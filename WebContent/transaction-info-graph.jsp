<%@page import="it.uniroma3.vi.model.Transaction"%>
<%@page import="java.util.*"%>

<!DOCTYPE html>
<html>
	<head>
	
		<link href="css/graph-style.css" rel="stylesheet" type="text/css">
		
		<% Transaction transaction = (Transaction) request.getAttribute("transaction"); %>
		<title>Transazione: <%
		    out.print(transaction.getId());
		%></title>
		
		<script src="js/d3.js" charset="utf-8"></script>
	
	</head>
	
	<body>
		<div id="tooltip" class="hidden">
            <p><span id="txhash">hash</span></p>
            <p><span id="value">100</span></p>
    	</div>
		
		<div class="svg">
		  	<span id="revert"><button onclick="revert()">Revert</button></span>
			<script src="js/graph-visualization-v2.js"></script>
			<script type="text/javascript">
				init(<%out.print(transaction.getId());%>);
			</script>
		</div>
	</body>
</html>