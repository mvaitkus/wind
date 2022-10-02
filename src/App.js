import axios from 'axios';
import { useEffect, useState } from 'react';
import { VictoryChart, VictoryTheme, VictoryLine } from 'victory';
import arrow from './right-arrow.svg'
import './App.css';

function App() {
  const [loading, setLoading] = useState(true)
  const [wind, setWind] = useState([[0, 0]])
  const [gusts, setGusts] = useState([[0, 0]])
  const [direction, setDirection] = useState([[0, 0]])

  useEffect(() => {
    const fetchData = async () => {
      const windResult = await axios("https://portofklaipeda.lt/wp-json/api/meteo_data?method=wind_speed");
      const gustResult = await axios("https://portofklaipeda.lt/wp-json/api/meteo_data?method=wind_gust_speed");
      const directionResult = await axios("https://portofklaipeda.lt/wp-json/api/meteo_data?method=wind_direction");

      setWind(windResult.data)
      setGusts(gustResult.data)
      setDirection(directionResult.data)
      setLoading(false)
    };

    fetchData();
  }, []);


  const nowMinus3h = new Date();
  nowMinus3h.setHours(nowMinus3h.getHours() - 3);

  const sanitizeWindPair = pair => {
    return {
      // Date component
      x: new Date(pair[0]),
      // wind strenght
      y: parseFloat(pair[1])
    }
  };

  const windData = wind.map(sanitizeWindPair).filter(value => value.x > nowMinus3h);

  const gustData = gusts.map(sanitizeWindPair).filter(value => value.x > nowMinus3h);

  
  const lastWindSpeed = parseFloat(wind[wind.length - 1][1]).toFixed(1)
  const lastUpdatedDate = new Date(wind[wind.length - 1][0])
  const lastUpdated = lastUpdatedDate.toLocaleString("lt-LT")
  const lastGustSpeed = parseFloat(gusts[gusts.length - 1][1]).toFixed(1)
  const lastWindDirection = parseFloat(direction[direction.length - 1][1])
  const arrowStyle = {
    transform: `rotate(${lastWindDirection + 90}deg)`,
    // width: "200px",
    height: "60px",
    color: "#FFFFFF"
  }

  const theme = VictoryTheme.material;
  theme.chart.padding = 40;

  const content = loading ? (<div></div>) : (
    <div className="Chart">
      <VictoryChart
        theme={theme}
      >
        <VictoryLine
          style={{
            data: { stroke: "#79c99eff", strokeWidth: 1 },
            parent: { border: "1px solid #ccc" }
          }}
          data={windData}
        />
        <VictoryLine
          style={{
            data: { stroke: "#508484ff", strokeWidth: 1 },
            parent: { border: "1px solid #ccc" }
          }}
          data={gustData}
        />
      </VictoryChart>
    </div>
  )

  return (
    <div className="App">
      <header className="App-header">
        <h1>Klaipėdos uosto vėjas</h1>
        <h4>
        <div className="Current-wind">
          <div className='Current-wind-labels'>
            Vėjas:<br />
            Gūsiai: <br />
            Kryptis: <br />
          </div>
          <div className="Current-wind-readings">
          {lastWindSpeed} m/s<br />
          {lastGustSpeed} m/s<br />
          {lastWindDirection.toFixed()}° <br />
          </div>
          <div><img src={arrow} style={arrowStyle} alt="logo" /></div>
        </div>
      </h4>
      </header>
      {content}
      <small>Atnaujinta {lastUpdated}</small>
    </div>
  );
}

export default App;
