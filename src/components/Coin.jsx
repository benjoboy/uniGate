import React, { Component } from "react";
import uniswapPrice from "uniswap-price";
import Axios from "axios";

class Coin extends Component {
  constructor() {
    super();
    this.timer = this.timer.bind(this);
  }
  state = {
    intervalId: 0,
    uniWethPrice: 0,
    uniUsdtPrice: 0,
    gateAskPrice: 0,
    gateBidPrice: 0,
    askDiff: 0,
    bidDiff: 0,
    decimals: 18,
  };

  componentDidMount() {
    var intervalId = setInterval(this.timer, this.props.coin.interval * 1000);
    this.setState({ intervalId: intervalId });

    if (
      this.props.coin.addr1 === "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    ) {
      this.setState({
        decimals: 18,
      });
    } else if (
      this.props.coin.addr1 === "0xdac17f958d2ee523a2206206994597c13d831ec7"
    ) {
      this.setState({
        decimals: 6,
      });
    }
    this.timer();
  }
  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }
  timer() {
    var wethPrice;

    //get uniswipe prices
    uniswapPrice
      .getMidPrice(
        this.props.coin.addr1,
        this.state.decimals,
        this.props.coin.addr2,
        18
      )
      .then(
        (data) => {
          console.log(data);
          wethPrice = data.quote2base;
          //price converison from WETH to USDT
          if (
            this.props.coin.addr1 ===
            "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
          ) {
            uniswapPrice
              .getMidPrice(
                "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // weth 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
                18,
                "0xdac17f958d2ee523a2206206994597c13d831ec7", // usdt 0xdac17f958d2ee523a2206206994597c13d831ec7
                6
              )
              .then(
                (data) => {
                  this.setState({
                    uniUsdtPrice: wethPrice * data.base2quote,
                    uniWethPrice: wethPrice,
                  });
                },
                (err) => {
                  console.log("err1", err);
                }
              );
          } else {
            this.setState({
              uniUsdtPrice: wethPrice,
              uniWethPrice: 0,
            });
          }
        },
        (err) => {
          console.log("err3", err);
        }
      );

    //get gateio prices

    Axios.get(
      `/api/v4/spot/order_book?currency_pair=` +
        this.props.coin.gatePair +
        "&limit=1",
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        },
      }
    ).then(
      (res) => {
        console.log(res);
        this.setState({
          gateAskPrice: res.data.asks[0][0],
          gateBidPrice: res.data.bids[0][0],
          askDiff:
            100 *
            ((res.data.asks[0][0] - this.state.uniUsdtPrice) /
              this.state.uniUsdtPrice),
          bidDiff:
            100 *
            ((res.data.bids[0][0] - this.state.uniUsdtPrice) /
              this.state.uniUsdtPrice),
        });
      },
      (err) => {
        console.log("error with GateIO pair", err);
      }
    );
    //compare prices
    if (
      this.state.bidDiff > this.props.coin.priceDifference &&
      this.state.bidDiff != Infinity
    ) {
      new Notification(
        "bid price of " +
          this.props.coin.gatePair +
          " is higher by " +
          this.state.bidDiff.toFixed(2) +
          "%"
      );
    }
    if (
      this.state.askDiff < -this.props.coin.priceDifference &&
      this.state.askDiff != Infinity
    ) {
      new Notification(
        "ask price of " +
          this.props.coin.gatePair +
          " is lower by " +
          this.state.bidDiff.toFixed(2) +
          "%"
      );
    }
  }

  render() {
    return (
      <div className="col-md-12 ">
        <label>{this.props.coin.gatePair}</label>
        <br />
        <label>
          <b>Uniswap</b> wethPrice: {this.state.uniWethPrice} &nbsp; usdtPrice:{" "}
          {Number(this.state.uniUsdtPrice).toFixed(4)}
        </label>
        <br />
        <label>
          <b>Gate.io</b> askPrice: {this.state.gateAskPrice}{" "}
          {this.state.askDiff.toFixed(2)}%
        </label>
        <br />

        <label>
          <b>Gate.io</b> bidPrice: {this.state.gateBidPrice}{" "}
          {this.state.bidDiff.toFixed(2)}%
        </label>
      </div>
    );
  }
}

export default Coin;
