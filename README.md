# React-pagination
A high render quality pagination component base on React.js
## JS Interface
### If JSX
	React.render(
		<Pagination
			url="/api/getproduct"
			data={
				{
					index : 1,
					size : 10,
					data : {
						name : "page"
					}
				}
			}
			index="1"
			size="10"
			supertype=""
			type=""
			status=""
			callback={
				function(componentState){
					React.render(
						<Product data={componentState.data} />,
						document.querySelector(".products")
					);
				}
			} />,
		document.querySelector("#pagination")
	);
### If JS
	React.render(
		React.createElement(Pagination, {
			url : "/api/getproduct",
			data : {
				index : 1,
				total : 10,
				data : {
					name : "page"
				}
			}
			index : "1",
			size : "10",
			supertype : "",
			type : "",
			status : "",
			callback :
				function(componentState){
					React.render(
						React.createElement(Product, {data: componentState.data}),
						document.querySelector(".products")
					);
				}
			}),
		document.querySelector("#pagination")
	);
## Server Interface
### If NodeJS
	app.get("/api/getproduct", function(req, res){
		res.json({
			index : parseInt(req.query.index) || 1,
			size : parseInt(req.query.size) || 10,
			total : 10,
			data : {
				name : "page" + (parseInt(req.query.index) || 1)
			}
		});
	});
