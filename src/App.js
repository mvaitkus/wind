import axios from 'axios';
import { useEffect, useState } from 'react';
import { VictoryChart, VictoryTheme, VictoryLine } from 'victory';
import arrow from './right-arrow.svg'
import './App.css';

function App() {
  const [wind, setWind] = useState([])
  const [gusts, setGusts] = useState([])
  const [direction, setDirection] = useState([[0, 0]])

  useEffect(() => {
    const fetchData = async () => {
      const windResult = await axios("https://portofklaipeda.lt/wp-json/api/meteo_data?method=wind_speed");
      const gustResult = await axios("https://portofklaipeda.lt/wp-json/api/meteo_data?method=wind_gust_speed");
      const directionResult = await axios("https://portofklaipeda.lt/wp-json/api/meteo_data?method=wind_direction");

      setWind(windResult.data)
      setGusts(gustResult.data)
      setDirection(directionResult.data)
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

  const lastWindDirection = parseFloat(direction[direction.length - 1][1])
  const arrowStyle = {
    transform: `rotate(${lastWindDirection + 90}deg)`,
    // width: "200px",
    // height: "200px"
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Klaipėdos uosto vėjas</h1>
        <VictoryChart
          theme={VictoryTheme.material}
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
        <h2>Dabartinė vėjo kryptis: {lastWindDirection.toFixed()}°</h2>
        <img src={arrow} style={arrowStyle} alt="logo" />
      </header>
    </div>
  );
}

export default App;
