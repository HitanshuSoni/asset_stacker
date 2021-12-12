import React, { useState, useMemo } from 'react'
import Chart from 'react-apexcharts';
import './App.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
require('dotenv').config()


const round = (number) => {
  return number ? +(number.toFixed(2)) : null;
};


const directionEmojis = {
  up: '🚀',
  down: '💩',
  '': '',
};

const chart = {
  options: {
    chart: {
      type: 'candlestick',
      height: 350
    },
    title: {
      text: 'CandleStick Chart',
      align: 'left'
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      tooltip: {
        enabled: true
      }
    }
  },
};


function App() {
  const [asset, setAsset] = useState('');
  
  const [series, setSeries] = useState([{
    data: []
  }]);
  const [price, setPrice] = useState(-1);
  const [prevPrice, setPrevPrice] = useState(-1);
  const [priceTime, setPriceTime] = useState(null);
  const [assetName, setassetName] = useState('')

  
  async function getStonks(){
    console.log(process.env.REACT_APP_KEY)
    const stockUrl = `https://finance-api-for-edu.p.rapidapi.com/${asset}`
  console.log(stockUrl)
    console.log("yoyo")
    const response =  await fetch(stockUrl, {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": 'finance-api-for-edu.p.rapidapi.com',
		"x-rapidapi-key": process.env.REACT_APP_KEY
	}
}) 
    
    
    return response.json()
  }

 
    
    async function getLatestPrice() {
      
      try {
        const data = await getStonks();
        console.log(data);
        const stock = data.chart.result[0];
        setPrevPrice(price);
        setPrice(stock.meta.regularMarketPrice.toFixed(2));
        setPriceTime(new Date(stock.meta.regularMarketTime * 1000));
        const quote = stock.indicators.quote[0];
        setassetName(stock.meta.symbol)
        const prices = stock.timestamp.map((timestamp, index) => ({
          x: new Date(timestamp * 1000),
          y: [quote.open[index], quote.high[index], quote.low[index], quote.close[index]].map(round)
        }));
        setSeries([{
          data: prices,
        }]);
      } catch (error) {
        console.log(error);
      }
      setTimeout(getLatestPrice, 1000 * 2);

    }


    const direction = useMemo(() => prevPrice < price ? 'up' : prevPrice > price ? 'down' : '', [prevPrice, price]);
  return (
    <div className="App">
      <div className="heading">Asset Stacker</div>
      <div className="warning">
        FOR EDUCATION PURPOSES ONLY!
        <br />
        DO NOT USE THIS SITE AS FINANCIAL ADVICE!
      </div>
      <div className="filler">
      <TextField id="standard-basic" label="Enter Asset Name" variant="standard" 
        type="text"
        
        
        onChange={e => setAsset(e.target.value)}
        value={asset}
        
      /> 
      <Button variant="contained" style={{marginBlockStart: "10px"}} type="submit" onClick={getLatestPrice}>Submit</Button> 
      </div>
      <div className="assetData">
      <div className="ticker">
        Asset Name {'->'} {assetName}
      </div>
      <div className="price-time">
        Price At {'->'} {priceTime && priceTime.toLocaleTimeString()}
      </div>
      <div className={['price', direction].join(' ')}>
        Price {'->'} {price} {directionEmojis[direction]}
      </div>
      
      </div>
      <Chart className="chartData" options={chart.options} series={series} type="candlestick" width="100%" height={320} />
    <footer className="footerjugad"></footer>
    </div>
  )
}

export default App
