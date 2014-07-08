<%@page import="it.uniroma3.vi.model.Transaction"%>
<%@page import="java.util.*"%>

<!DOCTYPE html>
<html>
<style>
.d3-tip {
  line-height: 1;
  font-weight: bold;
  padding: 12px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  border-radius: 2px;
}
</style>
	<head>
	
		<link href="css/sugiyama-style.css" rel="stylesheet" type="text/css">
		
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
    	
		<h1>Transazione: <%
		    out.print(transaction.getId());
		%></h1>
		<p>
			Hash: <%
		    out.print(transaction.getHash());
		%>
		</p>
		
		<script src="js/sugiyama-visualization-v2.js"></script>
		<script type="text/javascript">
			init(<%out.print(transaction.getId());%>);
		</script>
	</body>
</html>