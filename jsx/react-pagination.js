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
        var index = parseInt(this.props.index),
            total = this.props.data ? parseInt(this.props.data.total) : 1,
            size = parseInt(this.props.size);
        return this.props.data ? {
            index : index,
            prev : index >> 1 ? index - 1 : 0,
            next : index >= total ? total + 1 : index + 1,
            total : total,
            size : size,
            data : this.props.data.data
        } : {
            index : index || 1,
            total : total,
            size : size || 1
        };
    },
    getData : function(setting){
        var _setting = this.props;
        for(var i in setting){
            _setting[i] = setting[i];
        }
        var url = this.props.url;
        for(var i in _setting){
            if(i != "url" && i != "callback" && i!="data"){
                url += "&" + i + "=" + _setting[i];
            }
        }
        $.ajax({
            url : url.replace(/&/, "?"),
            success : function(data){
                var index = data.index,
                    total = data.total,
                    size = data.size,
                    data = data.data;
                this.setState({
                    index : index,
                    prev : index >> 1 ? index - 1 : 0,
                    next : index >= total ? total + 1 : index + 1,
                    total : total,
                    size : size,
                    data : data
                }, function(){
                    try{
                        this.props.callback(this.state);
                    }catch (e){
                        throw new Error("回调函数错误。");
                    }
                });
            }.bind(this)
        });
    },
    resetHandler : function(){
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
                        index: this.index,
                        size: size
                    });
                }
            };
        }
    },
    componentWillMount : function(){
        if(this.props.data){
            try{
                this.props.callback(this.state);
            }catch(e){
                throw new Error("回调函数错误。");
            }
        }else{
            this.getData(this.props);
        }
    },
    componentDidMount : function(){
        this.resetHandler();
    },
    componentDidUpdate : function(){
        this.resetHandler();
    },
    renderPageNumber : function(page, i, index){
        page.push(
            <Option className={(index == i + 1 ? "current" : "normal") + " page"} title={i + 1} index={i + 1} ref={"p" + (i + 1)} />
        );
    },
    render : function(){
        var pagination,
            page = [],
            index = this.state.index,
            total = this.state.total;
        if(total >> 1){
            page.push(<Option className="normal prev" title="上一页" index={this.state.prev || 0} ref="prev" />);
            if(total <= 5){
                for (var i = 0; i < total; i++){
                    this.renderPageNumber(page, i, index);
                }
            }else{
                this.renderPageNumber(page, 0, index);
                if(index < 4){
                    for(var i = 1; i < 4; i++){
                        this.renderPageNumber(page, i, index);
                    }
                    page.push(<li>...</li>);
                }else if(index < total - 2){
                    page.push(<li>...</li>);
                    for(var i = index - 2; i < index + 1; i++){
                        this.renderPageNumber(page, i, index);
                    }
                    page.push(<li>...</li>);
                }else{
                    page.push(<li>...</li>);
                    for (var i = total - 4; i < total - 1; i++){
                        this.renderPageNumber(page, i, index);
                    }
                }
                this.renderPageNumber(page, total - 1, index);
            }
            page.push(<Option className="normal next" title="下一页" index={this.state.next || 2} ref="next" />);
        }
        return (
            <ul className="pagination">
                {page}
            </ul>
        );
    }
});