import React from "react";
import { loadCards } from "../api/LoadCards/LoadCards";
const url = `https://api.elderscrollslegends.io/v1/cards`;
import "../style.css";

class InfiniteScroll extends React.Component {


  /* This is first step of  of react which gets triggered as soon as the component loaded
       Initial api call on this lifecycle as there is no input it will diplay all the results
  */
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: false,
      pageSize: 0,
      totalCount: 0,
      page: 1,
      nextPage: null,
      maxlimit: 12,
      splitSearchResults: [],
      position:0
    };
   
    this.getCards(url);
    this.scrollListener = window.addEventListener("scroll", e => {
      this.handleScroll(e);
    });
  }

  /* This is one of the lifecycle of react which gets triggered as soon as there any update in the props
     Any chnge in the text input will trigger this method leads to the api call
     loadCards is the api call to get the list of cards
  */
  componentDidUpdate(prevProps) {
    if (prevProps.results !== this.props.results) {
      const apiUrl = this.props.results
        ? `${url}?name=${this.props.results}`
        : url;

      loadCards(apiUrl).then(res => {
        this.setState({
          data: [...res.payload.cards],
          pageSize: res.payload._pageSize,
          totalCount: res.payload._totalCount,
          loading: false,
          nextPage: res.payload._links && res.payload._links.next,
          splitSearchResults: []
        }),
          this.onScrollDown();
      });
    }
    return;
  }

  /* 
   This method written to parent child commounication as soon as the state changes
   spinner will load
  */
  handleLoaderChange = (val) => {   
    this.props.onLoadertriggered(val);
  };

   /* 
    getCards method written once and utilised to trigger the api call
    onScrollDown 
  */
  getCards = url => {
    this.state.loading = true;
    this.handleLoaderChange(true);
    loadCards(url).then(res => {
      console.log("get cards call", res.payload);
      this.handleLoaderChange(false);
      this.setState({
        data: [...this.state.data, ...res.payload.cards],
        pageSize: res.payload._pageSize,
        totalCount: res.payload._totalCount,
        loading: false,
        nextPage: res.payload._links && res.payload._links.next
      },(window.scrollTo(0, this.state.position))),
        this.onScrollDown();
    });
    
  };

  /*
   Split the results in to 20 each time
  */
  onScrollDown = () => {
    const len = this.state.splitSearchResults.length;
    for (let i = len; i < len + 20; i++) {
      if (this.state.data[i]) {
        this.state.splitSearchResults.push(this.state.data[i]);
      }
    }
    this.setState({ splitSearchResults: this.state.splitSearchResults });
  };

   /*
   Used to find the scroller reaches the last element 
  */
  handleScroll = () => {
    var lastLi = document.querySelector("ul > li:last-child");
    var lastLiOffset = lastLi.offsetTop + lastLi.clientHeight;
    var pageOffset = window.pageYOffset + window.innerHeight;
    if (pageOffset > lastLiOffset) {
      this.state.data.length > this.state.splitSearchResults.length
        ? this.onScrollDown()
        : this.loadMore();
    }
  };

  /*
   Used to load more results
  */
  loadMore = () => {
    if (this.state.nextPage) {
      this.setState(prevState => ({
        page: prevState.page + 1,
        loading: true,
        position: window.pageYOffset
      })),
     
      this.getCards(this.state.nextPage);
    }
  };

  renderSpinner = () => {
    return <div className="loader"></div>;
  };

  render() {
    console.log("page count", this.state.page);
    console.log("render", this.state, this.props);
    return (
      <section style={styles.cards}>
        {this.state.loading ? this.renderSpinner() : ""}
        <ul style={styles.list}>
          {this.state.splitSearchResults &&
            this.state.splitSearchResults.map((data, index) => (
              <li
                key={index}
                style={
                  this.state.data && this.state.data.length <= 3
                    ? styles.center
                    : styles.align
                }
                src={data.imageUrl}
              >
                <figure>
                  <img
                    style={
                      this.state.data && this.state.data.length <= 3
                        ? styles.figure
                        : styles.img
                    }
                    src={data.imageUrl}
                  />
                </figure>
                <div style={styles.items}>
                  <div>
                    <label>Name : {data.name}</label>
                  </div>
                  {data.text ? (
                    <div>
                      <label>Text : {data.text} </label>
                    </div>
                  ) : (
                    ""
                  )}
                  <div>
                    <label>Set Name : {data.set && data.set.name}</label>
                  </div>
                  <div>
                    <label>Type : {data.type}</label>
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </section>
    );
  }
}

const styles = {
  cards: {
    padding: "2rem"
  },
  list: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gridGap: "1rem",
    listStyleType: "none"
  },
  items: {
    fontSize: "1rem",
    lineHeight: "1.5",
    paddingLeft: "3.5rem",
    color: "#666666"
  },
  img: {
    width: "80%"
  },
  figure: {
    width: "300px"
  },
  center: {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto"
  },
  align: {
    margin: 0
  }
};

export default InfiniteScroll;
