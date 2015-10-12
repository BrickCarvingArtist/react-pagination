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
## Notice
###Arguments in the interface like `supertype`, `type` and `status` can be changed into any other arguments which the server side need.
1. If you wanna initialize this component and make a request to get data from server side the same time, make sure you write down the `url` in the interface.
2. If you've got data outer this component and just wanna send the data into it, make sure you write both the `url` and the `data` down in the interface so that it will not send a request the first time you initialize it and send the requests only on your click events.
