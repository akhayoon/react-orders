var React = require('react');
var ReactDOM = require('react-dom');
var InlineEdit = require('react-inline-edit');
var ContentEditable = require('react-wysiwyg');

var OrdersApp = React.createClass({
  getInitialState: function() {
    return {Orderlist:this.props.orders};
  },
  handleNewRowSubmit: function( newOrder ) {
    this.setState( {Orderlist: this.state.Orderlist.concat([newOrder])} );
  },
  handleOrderRemove: function( Order ) {
    
    //TODO should find a better way to get the index
    var index = -1; 
    var clength = this.state.Orderlist.length;
    for( var i = 0; i < clength; i++ ) {
      if( this.state.Orderlist[i].cname === Order.cname ) {
        index = i;
        break;
      }
    }
    // this.state.Orderlist.splice( index, 1 );  
    // this.setState( {Orderlist: this.state.Orderlist} );

    // filtering out the index using list comprehensions 
    this.setState({
      Orderlist: this.state.Orderlist.filter((_, i) => i !== index)
    });
  },
  render: function() {
    return ( 
      <div>
        <OrderList clist={this.state.Orderlist}  onOrderRemove={this.handleOrderRemove}/>
        <NewRow onRowSubmit={this.handleNewRowSubmit}/>
      </div>
    );
  }
});

var OrderList = React.createClass({
  handleOrderRemove: function(order){
    this.props.onOrderRemove( order );
  },

  getInitialState: function(){
    return {
      editing: false
    }
  },

  enableEditing: function(){
    // set your contenteditable field into editing mode.
    this.setState({ editing: true });
  },

  render: function() {
    var orders = [];
    var that = this;
    this.props.clist.forEach(function(order) {
      orders.push(<Order order={order} onOrderDelete={that.handleOrderRemove} editing={that.state.editing} /> );
    });
    return ( 
      <div>
        <h3>Order List</h3>
        <table className="table table-striped">
          <thead><tr><th>Product</th><th>Quantity</th><th>Price</th><th>Total</th></tr></thead>
          <tbody>{orders}</tbody>
        </table>
        <button onClick={this.enableEditing}>
          Enable Editing
        </button>
      </div>
      );
  }
});

var Order = React.createClass({

  handleRemoveOrder: function() {
    this.props.onOrderDelete( this.props.order );
    return false;
  },


  getInitialState: function(){
    return {
      html: 'default text',
      placeholder: false,
      // editing: false
    }
  },

  onChange: function(textContent, setPlaceholder) {
    if (setPlaceholder) {
      this.setState({
        placeholder: true,
        html: ''
      })
    } else {
      this.setState({
        placeholder: false,
        html: textContent
      })
    }
  },

  render: function() {
    return (
      <tr>
        <td>{this.props.order.cname}</td>
        <td>{this.props.order.ecount}</td>
        <td>{this.props.order.hoffice}</td>
        <td><input type="button"  className="btn btn-primary" value="Remove" onClick={this.handleRemoveOrder}/></td>
        <td>
          <div className="edit">
            <ContentEditable
              tagName='div'
              onChange={this.onChange}
              html={this.state.html}
              preventStyling
              noLinebreaks
              placeholder={this.state.placeholder}
              placeholderText='Your Name'
              editing={this.props.editing}
            />
          </div>
        </td>
      </tr>
      );
  }
});

var NewRow = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault(); //stops page from refreshing
    var cname = 'Product #'
    var ecount = 0
    var hoffice = 0
    var newrow = {cname: cname, ecount: ecount, hoffice: hoffice };
    this.props.onRowSubmit( newrow );
  },
  render: function() {
    var inputStyle = {padding:'12px'}
    return ( 
          <a className="btn btn-primary" href="" onClick={this.handleSubmit}></a>
    );
  }
});
var defOrders = [{cname:"Product #1",ecount:3,hoffice:"$3.99"},{cname:"Product #2",ecount:6,hoffice:"$49.99"}];
 ReactDOM.render( <OrdersApp orders={defOrders}/>, document.getElementById( "OrdersApp" ) );