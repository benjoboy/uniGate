import React, { Component } from "react";

class Add extends Component {
  state = {};
  render() {
    return (
      <form onSubmit={(e) => this.props.handleSubmit(e)}>
        <div className="form-row">
          <div className="form-group col-md-3">
            <label htmlFor="addr1">Coin address 1</label>
            <select
              name="addr1"
              className="form-control"
              aria-label="Default select example"
              onChange={(e) => this.props.handleChange(e)}
              value={this.props.addr1}
            >
              <option
                defaultValue
                value="0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
              >
                WETH
              </option>
              <option value="0xdac17f958d2ee523a2206206994597c13d831ec7">
                USDT
              </option>
            </select>
            {/* <input
              type="text"
              className="form-control"
              id="coinAddress1"
              placeholder="Coin address 1"
              required
              name="addr1"
              value={this.props.addr1}
              onChange={(e) => this.props.handleChange(e)}
            /> */}
          </div>
          <div className="form-group col-md-3">
            <label htmlFor="coinAddress2">Coin address 2</label>

            <input
              type="text"
              className="form-control"
              id="coinAddress2"
              placeholder="Coin address 2"
              required
              name="addr2"
              value={this.props.addr2}
              onChange={(e) => this.props.handleChange(e)}
            />
          </div>
          <div className="form-group col-md-3">
            <label htmlFor="gatePair">Gate.io pair</label>
            <input
              className="form-control"
              type="text"
              id="gatePair"
              required
              name="gatePair"
              value={this.props.gatePair}
              onChange={(e) => this.props.handleChange(e)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-md-3">
            <label className="col-form-label" htmlFor="interval">
              Interval (seconds):&nbsp;
            </label>
            <input
              className="form-control"
              type="number"
              id="interval"
              required
              name="interval"
              value={this.props.interval}
              onChange={(e) => this.props.handleChange(e)}
            />
          </div>
          <div className="form-group col-md-3">
            <label className="col-form-label" htmlFor="priceDifferece">
              Minimal price difference for alert (%):&nbsp;
            </label>
            <input
              className="form-control"
              type="number"
              id="priceDifferece"
              required
              name="priceDifference"
              value={this.props.priceDifference}
              onChange={(e) => this.props.handleChange(e)}
            />
          </div>
          <div className="form-group col-md-3"></div>
        </div>
        <div className="form-row">
          <button type="submit" className="btn btn-primary col-md-6">
            Add coin
          </button>
        </div>
      </form>
    );
  }
}

export default Add;
