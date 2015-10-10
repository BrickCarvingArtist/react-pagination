var Product = React.createClass({
	render : function(){
		return (
			<div>
				{this.props.data.name}
			</div>
		);
	}
});
var Option = React.createClass({
	getInitialState : function(){
		return {
			index : this.props.index
		};
	},
	componentWillReceiveProps : function(nextProps){
		this.setState({
			index : nextProps.index
		});
	},
	render : function(){
		return (
			<li className={this.props.className}>
				{this.props.title}
			</li>
		);
	}
});
var Pagination = React.createClass({
	getInitialState : function(){
		return {
			index : this.props.index || 1,
			total : this.props.total || 1,
			size : this.props.size || 1
		};	
	},
	getData : function(setting){
		var _setting = this.props;
		for(var i in setting){
			_setting[i] = setting[i];
		}
		if(this.props.url){
			var url = this.props.url,
				count = 0;
			for(var i in _setting){
				if(count){
					url += "&" + i + "=" + _setting[i];
				}
				count = 1;
			}
			$.ajax({
				url : url.replace(/&/, "?"),
				success : function(data){
					var index = data.pageIndex,
						total = data.totalPage;
					this.setState({
						index : data.pageIndex,
						prev : index >> 1 ? index - 1 : 0,
						next : index >= total ? total + 1 : index + 1,
						total : data.totalPage,
						size : data.pageSize,
						data : data.data
					}, function(){
						React.render(
							<Product data={this.state.data} />,
							document.querySelector(".products")
						);
					});
				}.bind(this)
			});
		}
	},
	componentWillMount : function(){
		this.getData(this.props);
	},
	componentDidUpdate : function(){
		var _this = this,
			size = this.state.size,
			total = this.state.total,
			option;
		for(var i in this.refs){
			option = this.refs[i].getDOMNode();
			option.index = this.refs[i].state.index;
			option.onclick = function(){
				if(this.index && this.index <= total){
					_this.getData({
						index : this.index,
						size : size
					});
				}
			};
		}
	},
	renderNormalPage : function(page, i, index){
		page.push(
			<Option className={(index == i + 1 ? "current" : "normal") + " page"} title={i + 1} index={i + 1} ref={"p" + (i + 1)} />
		);
	},
	render : function(){
		var pagination,
			page = [],
			index = this.state.index,
			total = this.state.total;
		page.push(<Option className="normal prev" title="上一页" index={this.state.prev || 0} ref="prev" />);
		if(total <= 5){
			for(var i = 0; i < total; i++){
				this.renderNormalPage(page, i, index);
			}
		}else{
			if(index < total - 4){
				if(index < 3){
					for(var i = 0; i < 3; i++){
						this.renderNormalPage(page, i, index);
					}
				}else{
					for(var i = index - 2; i < index + 1; i++){
						this.renderNormalPage(page, i, index);
					}
				}
				page.push(<li>...</li>);
				page.push(
					<Option className={(index == i + 1 ? "current" : "normal") + " page"} title={total} index={total} ref={"p" + (total)} />
				);
			}else{
				page.push(
					<Option className={(index == i + 1 ? "current" : "normal") + " page"} title={1} index={1} ref={"p" + 1} />
				);
				page.push(<li>...</li>);
				if(index < total - 1){
					for(var i = index - 2; i < index + 1; i++){
						this.renderNormalPage(page, i, index);
					}
				}else{
					for(var i = total - 3; i < total; i++){
						this.renderNormalPage(page, i, index);
					}
				}
			}
		}
		page.push(<Option className="normal next" title="下一页" index={this.state.next || 2} ref="next" />);
		return (
			<ul className="pagination">
				{page}
			</ul>
		);
	}
});