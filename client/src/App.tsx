import React, { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';

// import components
import { ValueType } from 'react-select/src/types';
import { response } from 'express';
import DataTable from './components/DataTable';
import Visualization from './components/Visualization';

interface GeoCodeObj {
  components: { [key: string]: string };
  geometry: { [key: string]: string };
  formatted: string;
  timezone: { [key: string]: string };
}

const App = (): JSX.Element => {
  const [spaData, setSpaData] = useState({});
  const [searchResult, setSearchResult] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [apiFetchError, setApiFetchError] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState();

  useEffect((): void => {
    const fetchSPA = axios.get(
      'http://localhost:3000/spa?lat=39.742476&lng=-105.1786&day=17&month=10&year=2003&hour=12&minute=30&seconds=30&timezone=-7&'
    );

    fetchSPA
      .then((res): void => {
        setIsLoading(false);
        setSpaData(res.data);
      })
      .catch((err): void => {
        setApiFetchError(err);
      });

    const fetchLoc = axios.get(`http://localhost:3000/geocode?location=${searchQuery}`);

    fetchLoc.then((res): void => {
      setSearchResult(res.data);
    });
  }, []);

  useEffect((): void => {
    clearTimeout(typingTimeout);

    setTypingTimeout(
      setTimeout((): void => {
        const fetched = axios.get(`http://localhost:3000/geocode?location=${searchQuery}`);

        fetched.then((res): void => {
          setSearchResult(res.data);
        });
      }, 1000)
    );
  }, [searchQuery]);

  const handleSearchQueryInput = (e: React.FormEvent): void => {
    const { value } = e.target as HTMLInputElement;

    setSearchQuery(value);
  };

  // const triggerChange = (e: React.KeyboardEvent): void => {
  //   handleSearchQueryInput(e);
  // };

  // const handleInputKeyboardEvent = (e: React.KeyboardEvent): void => {
  //   // check if Enter Key was hit
  //   if (e.keyCode === 13) {
  //     clearTimeout(typingTimeout);
  //     triggerChange(e);
  //   }
  // };

  const handleSelect = (): void => {};

  const onSubmitHandler = (e: React.FormEvent): void => {
    e.preventDefault();
  };

  const parseSearchResult = (searchData: GeoCodeObj[]): JSX.Element[] => {
    const showResults = searchData.map(
      (data, index): JSX.Element => {
        return (
          // eslint-disable-next-line react/no-array-index-key
          <button type="button" onClick={handleSelect} className="search_select-button" key={`search-result-${index}`}>
            {data.formatted}
          </button>
        );
      }
    );
    return showResults;
  };
  return (
    <main className="App">
      <div id="DataTable" className="datatable">
        <DataTable data={spaData} isLoading={isLoading} apiFetchError={apiFetchError} />
      </div>
      <div id="Visualization" className="visualization">
        <Visualization />
      </div>
      <div id="Controls" className="controls">
        <h1>Controls:</h1>
        <form onSubmit={onSubmitHandler}>
          <label htmlFor="queryInput">
            {searchQuery}
            <input
              id="queryInput"
              value={searchQuery}
              type="text"
              // onKeyDown={handleInputKeyboardEvent}
              onChange={handleSearchQueryInput}
            />
          </label>
          <div className="queryResults">{parseSearchResult(searchResult)}</div>
          <input type="submit" value="Submit" />
        </form>
      </div>
    </main>
  );
};

export default App;
