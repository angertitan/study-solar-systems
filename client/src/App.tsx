import React, { useState, useEffect } from 'react';
import axios from 'axios';

// import components
import DataTable from './components/DataTable';
import Visualization from './components/Visualization';

const App = (): JSX.Element => {
  const [spaData, setSpaData] = useState({});
  const [searchResult, setSearchResult] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [apiIsLazy, setApiIsLazy] = useState(false);

  useEffect((): void => {
    const fetch = axios.get(
      'http://localhost:3000/spa?lat=39.742476&lng=-105.1786&day=17&month=10&year=2003&hour=12&minute=30&seconds=30&timezone=-7&'
    );

    fetch.then((result): void => {
      setIsLoading(false);
      setSpaData(result.data);
    });
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (apiIsLazy) {
      return;
    }
    setApiIsLazy(true);
    setTimeout((): void => {
      setApiIsLazy(false);
    }, 2000);
    const fetch = axios.get(`http://localhost:3000/geocode?location=${event.target.value}`);

    fetch.then((result): void => {
      setSearchResult(result.data);
    });
  };

  const handleSubmit = (): void => {
    console.log('hello');
  };

  const style = isLoading ? { display: 'none' } : {};

  return (
    <main className="App" style={style}>
      <DataTable data={['a']} />
      <Visualization data={searchResult} />

      <div id="Controls" className="controls">
        <h1>Controls:</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="locationSearch">
            Name:
            <input id="locationSearch" type="text" placeholder="Suche..." onChange={handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    </main>
  );
};

export default App;
