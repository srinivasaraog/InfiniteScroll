import React, { Component } from "react";
import VirtualCards from "./infiniteScroll";

class SearchComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInput: "",
      loading:false
    };
  }

  /* onClick event handler method */
  onClick = e => {
    this.setState({
      userInput: e.target.value
    });
  };

  onChange = e => {
    this.setState({
      userInput: e.target.value
    });
  };

  handleLoaderChange = (val) => {   
    this.setState({loading: val});
 }

  render() {
    return (
      <form>
        <div style={this.state.loading ? styles.overlay : styles.noOverlay}>
          <h1 style={styles.search}>Search For Cards</h1>
          <div style={styles.search} className="search">
            <input
              style={styles.searchcontainer}
              type="text"
              onChange={this.onChange}
              value={this.state.userInput}
              disabled={this.state.loading}
            />
            <span style={styles.searchIcon} className="fa fa-search"></span>
          </div>
          <VirtualCards onLoadertriggered={this.handleLoaderChange} results={this.state.userInput} />
        </div>
      </form>
    );
  }
}

const styles = {
  search: {
    textAlign: "center"
  },
  searchcontainer: {
    width: "60%",
    borderRadius: "25px",
    border: "2px solid #73AD21",
    padding: "10px"
  },
  searchIcon: {
    marginLeft: "-30px",
    color: "#73AD21"
  },
  overlay : {
    position: 'fixed',
    height: '100%',
    width: '100%',
    top:0,
    left: 0,
    backgroundColor:'#ccc',
    zIndex:'9999'
  },
  noOverlay:{
    top:0,
    left: 0
  }
  
};

export default SearchComponent;
