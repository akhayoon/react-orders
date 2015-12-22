
var _banners = [];

// get our initial banners from our store
function getBanners() {
   return [
    {"id": 1, "name": "banner 1", "imageUrl": "http://somegif.com", "targetUrl": "http://www.topcoder.com", "active": "Yes"},
    {"id": 2, "name": "banner 4", "imageUrl": "http://anothergif.com", "targetUrl": "http://www.appirio.com", "active": "Yes"},
    {"id": 3, "name": "banner 2", "imageUrl": "http://one-more-gif.com", "targetUrl": "http://www.topcoder.com/blog", "active": "Yes"}
  ]
}

var App = React.createClass({

  getInitialState: function() {
    _banners = getBanners();
    console.log(getBanners());
    console.log(_banners);
    return _banners;
  },

  render: function() {
    // var rows = this.state.banners.map(function(banner, i) {
    //   return (
    //     <tr keys={i}>
    //       <td>{banner.name}</td>
    //       <td>{banner.imageUrl}</td>
    //       <td>{banner.targetUrl}</td>
    //       <td>{banner.active}</td>
    //      </tr>
    //   )
    // });

   return (
      <p>
        Hello, <input type="text" placeholder="Your name here" />!
      </p>
    );
  }

});

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
