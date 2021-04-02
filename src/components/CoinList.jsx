import React, { Component } from "react";
import Add from "./Add";
import Coin from "./Coin";
import Axios from "axios";
import uniswapPrice from "uniswap-price";
import { v4 as uuidv4 } from "uuid";

class CoinList extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  state = {
    coinList: [],
    addr1: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    addr2: "0x8a40c222996f9f3431f63bf80244c36822060f12",
    interval: 30,
    priceDifference: 5,
    gatePair: "fxf_usdt",
  };

  componentDidMount() {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
    } else {
      Notification.requestPermission();
    }
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    var coin = {
      interval: this.state.interval,
      priceDifference: this.state.priceDifference,
      addr1: this.state.addr1,
      addr2: this.state.addr2,
      gatePair: this.state.gatePair,
      id: uuidv4(),
    };

    uniswapPrice
      .getMidPrice(
        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // weth 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
        18,
        "0xdac17f958d2ee523a2206206994597c13d831ec7", // usdt 0xdac17f958d2ee523a2206206994597c13d831ec7
        6
      )
      .then(
        (data) => {
          console.log(coin.gatePair);
          Axios.get(`/api/v4/spot/order_book?currency_pair=` + coin.gatePair, {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods":
                "GET,PUT,POST,DELETE,PATCH,OPTIONS",
            },
          }).then(
            (res) => {
              console.log("xoin", res);
              this.setState((previousState) => {
                return {
                  coinList: [...previousState.coinList, coin],
                };
              });
            },
            (err) => {
              console.log("error with GateIO pair", err);
            }
          );
        },
        (err) => {
          console.log("err with uniswap address", err);
        }
      );

    //this.setState({ coinList: this.state.coinList.push(coin) });
  }

  handleDelete(id) {
    const list = this.state.coinList.filter((x) => {
      return x.id !== id;
    });

    this.setState({ coinList: list });
  }

  render() {
    var lists = this.state.coinList.map((coin) => {
      return (
        <div key={coin.id}>
          <Coin coin={coin} handleDelete={this.handleDelete} />
        </div>
      );
    });
    return (
      <div>
        <h1>CoinList</h1>
        <Add
          addr1={this.state.addr1}
          addr2={this.state.addr2}
          interval={this.state.interval}
          priceDifference={this.state.priceDifference}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
          gatePair={this.state.gatePair}
        />
        <div className="row pt-3">{lists}</div>
      </div>
    );
  }
}

export default CoinList;
