<!DOCTYPE html>
<html>
<head>
<title>Index</title>
</head>
<body>
	<h1>Find block</h1>
	<form action="findblock.do" method="POST">
		<p>
			Id: <input type="text" name="id" />
		</p>
		<p>
			<input type="reset" value="Reimposta" />
		</p>
		<p>
			<input type="submit" value="Cerca" name="submit" />
		</p>
	</form>
	
	<h1>Find transaction(Graph)</h1>
	<form action="findTransactionGraph.do" method="POST">
		<p>
			Id: <input type="text" name="id" />
		</p>
		<p>
			<input type="reset" value="Reimposta" />
		</p>
		<p>
			<input type="submit" value="Cerca" name="submit" />
		</p>
	</form>
	
	<h1>Find transaction</h1>
	<form action="findtransaction.do" method="POST">
		<p>
			Id: <input type="text" name="id" />
		</p>
		<p>
			<input type="reset" value="Reimposta" />
		</p>
		<p>
			<input type="submit" value="Cerca" name="submit" />
		</p>
	</form>
</body>
</html>