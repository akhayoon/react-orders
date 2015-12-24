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
    var editingBool = (this.state.editing ? false : true);
    this.setState({ editing: editingBool });
  },

  render: function() {
    var orders = [];
    var that = this;
    this.props.clist.forEach(function(order) {
      orders.push(<Order order={order} onOrderDelete={that.handleOrderRemove} editing={that.state.editing} /> );
    });
    var quantityStyle = {width: '10%'};
    var noteStyle     = {width: '20%'};
    var editButton    = {marginBottom: '14px'};
    return ( 
      <div>
        <div>
          <button className="btn btn-primary" onClick={this.enableEditing} style={editButton}>
            {(this.state.editing ? <div>Disable Editing</div> : <div>Enable Editing</div>)} 
          </button>
        </div>
        <table className="table table-striped">
          <thead><tr><th>Product</th><th style={noteStyle}></th><th style={quantityStyle}>Quantity</th><th>Price</th><th>Total</th></tr></thead>
          <tbody>{orders}</tbody>
        </table>
      </div>
      );
  }
});

var EditContent = React.createClass({
  // getInitialState: function(){
  //   return {
  //     html: 'default text'
  //   };
  // },

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
    return(
      <div className="edit">
        <ContentEditable
          tagName='div'
          onChange={this.onChange}
          html={this.props.html}
          preventStyling
          noLinebreaks
          editing={this.props.editing}
        />
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
      showSelect: true,
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
    this.props.order.price = textContent;
  },

  handleChange: function(event) {
    this.setState({ newQuantity: event.target.value });
    this.props.order.quantity = event.target.value;
  },

  logChange: function(val) {
    console.log("Selected: " + val);
    this.props.order.product = val;
  },

  showSelect: false,

  onClick: function() {
    console.log('hello');
    this.setState({showSelect: true});
    console.log(this.state.showSelect);
  },

  onClick2: function() {
    console.log('seond');
    this.setState({showSelect: false});
    console.log(this.state.showSelect);
  },

  render: function() {
    
    var options = [
      { value: 'product1', label: 'Product #1' },
      { value: 'product2', label: 'Product #3' }
    ];

    var pullLeft = {float: 'left'}

    var total = this.props.order.quantity * (parseFloat(this.props.order.price));

    var numberStyle = {width: '50%', paddingLeft: '15%'};
    return (
      <tr>
        <td >
            {this.state.showSelect
              ? <div onClick={this.onClick2}>{this.props.order.product}</div> 
              : <Select
                  name="form-field-name"
                  value={this.props.order.product}
                  options={options}
                  onChange={this.logChange}
                  onBlur={this.onClick}
                />
            }
        </td>
        <td><EditContent editing={this.props.editing} html="Add Note..." /></td>
        <td><input type="number" value={this.props.order.quantity} onChange={this.handleChange} style={numberStyle} /></td>
        <td>
          {/* ContentEditable needs to be inside this component 
              since we rely on its value to update the total through
              this.props.order.price */}
          <div className="edit">
            <ContentEditable
              tagName='div'
              onChange={this.onChange}
              html={this.props.order.price}
              preventStyling
              noLinebreaks
              editing={this.props.editing}
            />
          </div>
        </td>
        <td>${total.toFixed(2)}</td>
        <td><input type="button"  className="btn btn-primary" value="Remove" onClick={this.handleRemoveOrder}/></td>
      </tr>
      );
  }
});

var NewRow = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault(); //stops page from refreshing
    var product = 'Select a Product'
    var quantity = 0
    var price = '0.00'
    var newrow = {product: product, quantity: quantity, price: price };
    this.props.onRowSubmit( newrow );
  },
  render: function() {
    var inputStyle = {padding:'12px'}
    return ( 
          <a className="btn btn-primary" href="" onClick={this.handleSubmit}>
          <img src="https://starsskincare.com/wp-content/uploads/2015/04/Plus_Sign.png" width="25px" height="25px" />
          </a>
    );
  }
});
var defOrders = [{product:"Product #1",quantity:3,price:"3.99"},{product:"Product #2",quantity:6,price:"49.99"}];
 ReactDOM.render( <OrdersApp orders={defOrders}/>, document.getElementById( "OrdersApp" ) );