import { Button, Drawer, Typography } from "@mui/material"
import { Box } from "@mui/system"
import React, { useState } from "react"
import { v4 as uuidv4 } from "uuid"

const Add = ({ handleAdd }) => {
  const [addr1, setAddr1] = useState(
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
  )
  const [addr2, setAddr2] = useState(
    "0x8a40c222996f9f3431f63bf80244c36822060f12"
  )
  const [interval, setInterval] = useState(30)
  const [priceDiff, setPriceDiff] = useState(5)
  const [gatePair, setGatePair] = useState("fxf_usdt")
  const [showDrawer, setShowDrawer] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    var coin = {
      interval,
      priceDifference: priceDiff,
      addr1,
      addr2,
      gatePair,
      id: uuidv4(),
    }
    handleAdd(coin)
  }

  return (
    <> 
    <Button variant='white' size='small' onClick={() => setShowDrawer(true)}>Add new</Button>
    <Drawer open={showDrawer} onClose={() => setShowDrawer(false)} anchor='right'>
      <Box padding={5}>
        <Typography variant='h3' pb={5}> Add Coin</Typography>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group col-md-3">
              <label htmlFor="addr1">Coin address 1</label>
              <select
                name="addr1"
                className="form-control"
                aria-label="Default select example"
                onChange={(e) => setAddr1(e.target.value)}
                value={addr1}
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
                value={addr2}
                onChange={(e) => setAddr2(e.target.value)}
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
                value={gatePair}
                onChange={(e) => setGatePair(e.target.value)}
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
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
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
                value={priceDiff}
                onChange={(e) => setPriceDiff(e.target.value)}
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
      </Box>
    </Drawer>
    </>
  )
}

export default Add
