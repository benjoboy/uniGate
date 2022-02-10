import { Grid, Paper } from "@mui/material"
import axios from "axios"
import { useEffect, useState } from "react"
import uniswapPrice from "uniswap-price"

export const Coin = ({ coin, handleDelete }) => {
  const [uniWethPrice, setUniWethPrice] = useState(0)
  const [uniUsdtPrice, setUniUsdtPrice] = useState(0)
  const [gateAskPrice, setGateAskPrice] = useState(0)
  const [gateBidPrice, setGateBidPrice] = useState(0)
  const [askDiff, setAskDiff] = useState(0)
  const [bidDiff, setBidDiff] = useState(0)

  const timer = async () => {
    console.log("timer")
    //get uniswipe prices
    try {
      let decimals
      if (coin.addr1 === "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2") {
        decimals = 18
      } else if (coin.addr1 === "0xdac17f958d2ee523a2206206994597c13d831ec7") {
        decimals = 6
      }
      const [data1, data2] = await Promise.all([
        // eslint-disable-next-line
        uniswapPrice.getMidPrice(coin.addr1, decimals, coin.addr2, 18),
        uniswapPrice.getMidPrice(
          "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // weth 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
          18,
          "0xdac17f958d2ee523a2206206994597c13d831ec7", // usdt 0xdac17f958d2ee523a2206206994597c13d831ec7
          6
        ),
      ])

      let uniUsdtPriceTmp
      let uniWethPriceTmp
      //price converison from WETH to USDT
      if (coin.addr1 === "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2") {
        uniUsdtPriceTmp = data1.quote2base * data2.base2quote
        uniWethPriceTmp = data1.quote2base
        setUniUsdtPrice(uniUsdtPriceTmp)
        setUniWethPrice(uniWethPrice)
      } else {
        uniUsdtPriceTmp = data1.quote2base
        uniWethPriceTmp = 0
        setUniUsdtPrice(uniUsdtPriceTmp)
        setUniWethPrice(uniWethPriceTmp)
      }

      //get gateio prices
      const gateioData = await axios.get(
        `/api/v4/spot/order_book?currency_pair=` + coin.gatePair + "&limit=1",
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
        }
      )
      const gateAskPriceTmp = gateioData.data.asks[0][0]
      const gateBidPriceTmp = gateioData.data.bids[0][0]
      const askDiffTmp =
        100 * ((gateioData.data.asks[0][0] - uniUsdtPriceTmp) / uniUsdtPriceTmp)
      const bidDiffTmp =
        100 * ((gateioData.data.bids[0][0] - uniUsdtPriceTmp) / uniUsdtPriceTmp)
      setGateAskPrice(gateAskPriceTmp)
      setGateBidPrice(gateBidPriceTmp)
      setAskDiff(askDiffTmp)
      setBidDiff(bidDiffTmp)

      //compare prices
      if (bidDiffTmp > coin.priceDifference && bidDiffTmp !== Infinity) {
        new Notification(
          "bid price of " +
            coin.gatePair +
            " is higher by " +
            bidDiffTmp.toFixed(2) +
            "%"
        )
      }
      if (askDiffTmp < -coin.priceDifference && askDiffTmp !== Infinity) {
        new Notification(
          "ask price of " +
            coin.gatePair +
            " is lower by " +
            bidDiffTmp.toFixed(2) +
            "%"
        )
      }
    } catch (e) {
      console.log("error in timer", e)
    }
  }

  useEffect(() => {
    const intervalId = setInterval(timer, coin.interval * 1000)
    timer()

    return clearInterval(intervalId)
  }, [coin.interval, timer])

  return (
    <Grid item style={{ border: "1px solid red" }} padding={5}>
      <Paper elevation={4} padding={5}>
        <label>{coin.gatePair.toUpperCase()}</label>
        <br />
        <label>
          <b>Uniswap</b> wethPrice: {uniWethPrice} &nbsp; usdtPrice:{" "}
          {Number(uniUsdtPrice).toFixed(4)}
        </label>
        <br />
        <label>
          <b>Gate.io</b> askPrice: {gateAskPrice} {askDiff.toFixed(2)}%
        </label>
        <br />
        <label>
          <b>Gate.io</b> bidPrice: {gateBidPrice} {bidDiff.toFixed(2)}%
        </label>
        <br />
        <button
          className="btn btn-primary"
          onClick={() => handleDelete(coin.id)}
        >
          Remove
        </button>
      </Paper>
    </Grid>
  )
}
