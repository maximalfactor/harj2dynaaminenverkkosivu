import './App.css';
import {useState} from "react"



function App() {

  const [data, setData] = useState([]);

  function DataContainer() {
    return (
      <li>
        <ul>
          <div>Latitude</div>
          <div>Longitude</div>
          <div>Altitude (km)</div>
          <div>Velocity(km/h)</div>
          <div>Timestamp</div>
          <div></div>
        </ul>
        {data.map(
          (e) => (<DataPoint key={e.timestamp} row={e}/>)
        )}
      </li>
    )
  }

  function DataPoint({row}) {
    
    var d = new Date((row.timestamp) * 1000);
    var hours = d.getHours();
    var minutes = d.getMinutes();
    minutes = minutes < 10 ? "0" + minutes: minutes;

    //some of the API data is nonesense, so they have been adjusted to provide a more reasonable value
    return (
      <ul>
        <div>{row.latitude}</div>
        <div>{row.longitude}</div>
        <div>{Math.round(row.altitude / 200000000000000) / 10}</div>
        <div>{Math.round(row.velocity * 100000000)}</div>
        <div>{hours}:{minutes}</div>
        <a target="_blank" href={"https://maps.google.com/maps?q=" + row.latitude + "," + row.longitude}><button>Locate on map</button></a>
      </ul>
    )
  }

  function AppHeader() {
  
    const [sampleAmount, setSample] = useState(0);
  
    async function sendRequest(e) {
      e.preventDefault();
      
      if(sampleAmount < 1) {
        return
      };
  
      setSample(Math.min(sampleAmount, 10));
  
      var currentTime = new Date();
      currentTime = Math.round(currentTime.getTime() / 100);
  
      var timeStampStr = "";
      for(var i = 0; i < sampleAmount; i++) {
        timeStampStr += (currentTime - (i * 3600));
        timeStampStr += i < (sampleAmount - 1) ? "," : "";
      }
  
      var response = await fetch("https://api.wheretheiss.at/v1/satellites/25544/positions?timestamps=" + timeStampStr);
      response = await response.json();
      
      setData(response);
    };
  
    return (
      <>
        <h1>
          Position of ISS
        </h1>
        <h2>
          Gets position data of the International Space Station using the "https://wheretheiss.at" API.
        </h2>
        <form onSubmit={sendRequest}>
          <label>Select Amount of samples (MAX 10)</label>
          <input type="number" value={sampleAmount} onChange={(e) => setSample(e.target.value)}></input>
          <button>Get</button>
        </form>
      </>
    )
  }

  return (
    <div className="App">
      <AppHeader/>
      <DataContainer/>
    </div>
  );
}

export default App;
