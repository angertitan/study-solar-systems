import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DateTimePicker from 'react-datetime-picker';
import * as dfns from 'date-fns';

// import components
import DataTable from './components/DataTable';
import Visualization from './components/Visualization';

interface GeoCodeObj {
  components: { [key: string]: string };
  geometry: { [key: string]: string };
  formatted: string;
  timezone: { [key: string]: string };
}

interface SPAObject {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  tz: number;
  lng: string;
  lat: string;
}

const App = (): JSX.Element => {
  const [spaData, setSpaData] = useState({});
  const [searchResult, setSearchResult] = useState([]);
  const [awaitResult, setAwaitResult] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [apiFetchError, setApiFetchError] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState();
  const [date, setDate] = useState(new Date());
  const [submitError, setSubmitError] = useState();

  useEffect((): void => {
    clearTimeout(typingTimeout);

    setTypingTimeout(
      setTimeout((): void => {
        if (!searchQuery) {
          setSearchResult([]);
          return;
        }

        setAwaitResult(true);
        const fetched = axios.get(`http://localhost:3000/geocode?location=${searchQuery}`);

        fetched.then((res): void => {
          setSearchResult(res.data);
          setAwaitResult(false);
        });
      }, 500)
    );
  }, [searchQuery]);

  const fetchSPAData = (spa: SPAObject): void => {
    const { year, month, day, hour, minute, second, tz, lng, lat } = spa;

    const fetchSPA = axios.get(
      `http://localhost:3000/spa?lat=${lat}&lng=${lng}&day=${day}&month=${month}&year=${year}&hour=${hour}&minute=${minute}&seconds=${second}&timezone=${tz}&`
    );

    fetchSPA
      .then((res): void => {
        setIsLoading(false);
        setSpaData(res.data);
      })
      .catch((err): void => {
        setApiFetchError(err);
      });
  };

  const handleSearchQueryInput = (e: React.FormEvent): void => {
    const { value } = e.target as HTMLInputElement;

    setSearchQuery(value);
  };

  const handleSelect = (e: React.FormEvent): void => {
    const { innerHTML } = e.target as HTMLButtonElement;

    setSearchQuery(innerHTML);
  };

  const onSubmitHandler = (e: React.FormEvent): void => {
    e.preventDefault();

    const choosenResult: GeoCodeObj[] = searchResult.filter(
      (result: GeoCodeObj): boolean => result.formatted === searchQuery
    );

    if (choosenResult.length < 1) {
      setSubmitError('You need to select a City from the List');
      return;
    }

    const tz = Number(choosenResult[0].timezone.offset_sec) / 3600;

    const spa = {
      year: dfns.getYear(date),
      month: dfns.getMonth(date),
      day: dfns.getDate(date),
      hour: dfns.getHours(date),
      minute: dfns.getMinutes(date),
      second: dfns.getSeconds(date),
      tz,
      lng: choosenResult[0].geometry.lng,
      lat: choosenResult[0].geometry.lat
    };

    fetchSPAData(spa);
  };

  const parseSearchResult = (searchData: GeoCodeObj[]): JSX.Element[] | JSX.Element => {
    const filteredData = searchData.filter((data): boolean => data.formatted.includes(searchQuery));

    if (!searchQuery) {
      return <div>Stadtnamen suchen mit OpenCage</div>;
    }
    if (awaitResult) {
      return <div>...Loading</div>;
    }

    const elementsFiltered = filteredData.map(
      (data, index): JSX.Element => {
        return (
          /* eslint-disable react/no-array-index-key */
          <button
            type="button"
            onClick={handleSelect}
            className="controls_search-results-btn"
            key={`search-result-${index}`}>
            {data.formatted}
          </button>
          /* eslint-enable react/no-array-index-key */
        );
      }
    );

    return elementsFiltered;
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
          <label htmlFor="controls_search-input">
            Stadtname:
            <input
              id="controls_search-input"
              value={searchQuery}
              type="text"
              // onKeyDown={handleInputKeyboardEvent}
              onChange={handleSearchQueryInput}
            />
            <div className="controls_search-results">{parseSearchResult(searchResult)}</div>
          </label>
          <div className="controls_datetime-picker">
            <DateTimePicker
              value={date}
              disableClock
              clearIcon={null}
              onChange={(newDate: Date): void => setDate(newDate)}
            />
          </div>
        </form>
      </div>
    </main>
  );
};

export default App;
