var React = require('react');
var ReactDOM = require('react-dom');
var ContentEditable = require('react-wysiwyg');
var Select = require('react-select');


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
      if( this.state.Orderlist[i].product === Order.product ) {
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
      newQuantity: this.props.order.quantity
      //newPrice:    this.props.order.price
      // editing: false
    };
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

  handleChange: function(event) {
    this.setState({ newQuantity: event.target.value });
  },

  render: function() {
    var showSelect = false;
    if (this.props.order.product.localeCompare('') === 0 ) {
      showSelect = true;
    }
    
    var options = [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' }
    ];

    function logChange(val) {
      console.log("Selected: " + val);
    }

    var total = this.state.newQuantity * parseFloat(this.props.order.price.slice(1));

    var numberStyle = {width: '15%', paddingLeft: '5%'};
    return (
      <tr>
        <td>
          {(showSelect
            ? <Select
                name="form-field-name"
                value="one"
                options={options}
                onChange={logChange}
              />
            : <div>{this.props.order.product}</div>
          )}
        </td>
        <td><input type="number" value={this.state.newQuantity} onChange={this.handleChange} style={numberStyle} /></td>
        <td>{this.props.order.price}</td>
        <td>{total}</td>
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
    var product = ''
    var quantity = 0
    var price = 0
    var newrow = {product: product, quantity: quantity, price: price };
    this.props.onRowSubmit( newrow );
  },
  render: function() {
    var inputStyle = {padding:'12px'}
    return ( 
          <a className="btn btn-primary" href="" onClick={this.handleSubmit}></a>
    );
  }
});
var defOrders = [{product:"Product #1",quantity:3,price:"$3.99"},{product:"Product #2",quantity:6,price:"$49.99"}];
 ReactDOM.render( <OrdersApp orders={defOrders}/>, document.getElementById( "OrdersApp" ) );