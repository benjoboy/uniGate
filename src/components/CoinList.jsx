import { Box, Grid, Typography } from "@mui/material"
import axios from "axios"
import { useEffect, useState } from "react"
import uniswapPrice from "uniswap-price"
import Add from "./Add"
import { Coin } from "./Coin"

export const CoinList = () => {
  const [coinList, setCoinList] = useState([])

  useEffect(() => {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification")
    } else {
      Notification.requestPermission()
    }
    const coinListTmp = JSON.parse(localStorage.getItem("CoinList"))
    if (coinListTmp) setCoinList(coinListTmp)
  }, [])

  const handleSubmit = async (coin) => {
    let decimals
    if (coin.addr1 === "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2") {
      decimals = 18
    } else if (coin.addr1 === "0xdac17f958d2ee523a2206206994597c13d831ec7") {
      decimals = 6
    }
    const ethData = await uniswapPrice.getMidPrice(
      coin.addr1,
      decimals,
      coin.addr2,
      18
    )
    const gateIoData = await axios.get(
      `/api/v4/spot/order_book?currency_pair=` + coin.gatePair,
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        },
      }
    )
    console.log(gateIoData)
    if (gateIoData && ethData) setCoinList((prev) => [...prev, coin])
  }
  useEffect(() => {
    localStorage.setItem("CoinList", JSON.stringify(coinList))
  }, [coinList])

  const handleDelete = (id) => {
    setCoinList((prev) => {
      const tmpList = prev.filter((coin) => coin.id !== id)
      return tmpList
    })
  }

  const lists = coinList.map((coin) => {
    return (
      <div key={coin.id}>
        <Coin key={coin.id} coin={coin} handleDelete={handleDelete} />
      </div>
    )
  })

  return (
    <div>
      <Box my={4}>
        <Typography variant="h3">UniGate</Typography>
      </Box>
      <Add handleAdd={handleSubmit} handleDelete={handleDelete} />
      <Grid container>{lists}</Grid>
    </div>
  )
}
