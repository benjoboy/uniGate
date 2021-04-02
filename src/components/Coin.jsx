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
    this.cancelSetState = true;
    if (this.state.intervalId) {
      clearInterval(this.state.intervalId);
      console.log("cleared1");
    }
    console.log("cleared2");
  }

  async timer() {
    console.log("timer");
    //get uniswipe prices
    const [data1, data2] = await Promise.all([
      // eslint-disable-next-line
      uniswapPrice.getMidPrice(
        this.props.coin.addr1,
        this.state.decimals,
        this.props.coin.addr2,
        18
      ),
      uniswapPrice.getMidPrice(
        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // weth 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
        18,
        "0xdac17f958d2ee523a2206206994597c13d831ec7", // usdt 0xdac17f958d2ee523a2206206994597c13d831ec7
        6
      ),
    ]);

    if (this.cancelSetState) {
      return;
    }

    //price converison from WETH to USDT
    if (this.props.coin.addr1 === "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2")
      this.setState({
        uniUsdtPrice: data1.quote2base * data2.base2quote,
        uniWethPrice: data1.quote2base,
      });
    else {
      this.setState({
        uniUsdtPrice: data1.quote2base,
        uniWethPrice: 0,
      });
    }

    //get gateio prices
    const gateioData = await Axios.get(
      `/api/v4/spot/order_book?currency_pair=` +
        this.props.coin.gatePair +
        "&limit=1",
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        },
      }
    );
    if (this.cancelSetState) {
      return;
    }

    this.setState({
      gateAskPrice: gateioData.data.asks[0][0],
      gateBidPrice: gateioData.data.bids[0][0],
      askDiff:
        100 *
        ((gateioData.data.asks[0][0] - this.state.uniUsdtPrice) /
          this.state.uniUsdtPrice),
      bidDiff:
        100 *
        ((gateioData.data.bids[0][0] - this.state.uniUsdtPrice) /
          this.state.uniUsdtPrice),
    });

    //compare prices
    if (
      this.state.bidDiff > this.props.coin.priceDifference &&
      this.state.bidDiff !== Infinity
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
      this.state.askDiff !== Infinity
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
        <br />
        <button
          className="btn btn-primary"
          onClick={() => this.props.handleDelete(this.props.coin.id)}
        >
          Remove
        </button>
      </div>
    );
  }
}

export default Coin;
