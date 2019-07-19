import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import DateTimePicker from 'react-datetime-picker';
import Slider from 'rc-slider';
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

interface SPAResponse {
  jd: string;
  dPsi: string;
  dEpsilon: string;
  epsilon: string;
  zenith: string;
  azimuth: string;
  incidence: string;
  sr: string;
  ss: string;
}

type DataType = { [key: string]: string } & SPAResponse;

const App = (): JSX.Element => {
  const [spaData, setSpaData] = useState<DataType>();
  const [searchResult, setSearchResult] = useState([]);
  const [awaitResult, setAwaitResult] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiFetchError, setApiFetchError] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState();
  const [date, setDate] = useState(new Date());
  const [sunSet, setSunset] = useState(72000);
  const [sunRise, setSunRise] = useState(24000);
  const [timeInSec, setTimeInSec] = useState();
  const [submitError, setSubmitError] = useState();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect((): void => {
    clearTimeout(typingTimeout);

    setTypingTimeout(
      setTimeout((): void => {
        if (!searchQuery) {
          setSearchResult([]);
          return;
        }

        setAwaitResult(true);
        console.log(searchQuery);
        const url = `http://localhost:3000/geocode?location=${searchQuery}`;
        console.log(url);
        const fetched = axios.get(url);

        fetched.then((res): void => {
          console.log(res.data);
          setSearchResult(res.data);
          setAwaitResult(false);
        });
      }, 500)
    );
  }, [searchQuery]);

  useEffect((): void => {
    const today = new Date().getTime();
    const midNight = dfns.setHours(new Date(), 0).setMinutes(0, 0);

    const theTime = (today - midNight) / 1000;

    setTimeInSec(theTime);
  }, []);

  const timeToSec = (timeString: string): number => {
    const split = timeString.split(':');

    const h = Number(split[0]);
    const m = Number(split[1]);
    const s = Number(split[2]);

    return h * 60 * 60 + m * 60 + s;
  };

  const fetchSPAData = (spa: SPAObject): void => {
    const { year, month, day, hour, minute, second, tz, lng, lat } = spa;

    const fetchSPA = axios.get(
      `http://localhost:3000/spa?lat=${lat}&lng=${lng}&day=${day}&month=${month}&year=${year}&hour=${hour}&minute=${minute}&seconds=${second}&timezone=${tz}&`
    );

    fetchSPA
      .then((res): void => {
        setIsLoading(false);

        const { ss, sr } = res.data;

        const ssInSec = timeToSec(ss);
        const srInSec = timeToSec(sr);
        setSunset(ssInSec);
        setSunRise(srInSec);

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

    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }

    setSearchQuery(innerHTML);
  };

  const calcSPAData = (): void => {
    setIsLoading(true);
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

  const onSubmitHandler = (e: React.FormEvent): void => {
    console.log('submit');
    calcSPAData();
    e.preventDefault();
  };

  const parseSearchResult = (searchData: GeoCodeObj[]): JSX.Element[] | JSX.Element => {
    const filteredData = searchData.filter((data): boolean => data.formatted.includes(searchQuery));

    if (!searchQuery) {
      return <div className="controls_search-results-placeholder">Stadtnamen suchen mit OpenCage</div>;
    }
    if (awaitResult) {
      return <div className="controls_search-results-loading">Loading...</div>;
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

    console.log(elementsFiltered);
    return elementsFiltered;
  };

  const onKeyDownHandler = (e: React.KeyboardEvent): void => {
    if (e.keyCode === 13) {
      onSubmitHandler(e);
    }
  };

  const handleSlider = (value: number): void => {
    const diff = value - timeInSec;

    setTimeInSec(value);
    setDate(dfns.addSeconds(date, diff));
  };

  const sliderSunRiseStyles = { background: '#FFB66B', color: 'black', fontWeight: 'bold', padding: '0.25rem' };
  const sliderSunSetStyles = { background: '#F54E23', color: 'black', fontWeight: 'bold', padding: '0.25rem' };

  return (
    <main className="App">
      <div id="DataTable" className="datatable">
        <DataTable data={spaData} isLoading={isLoading} apiFetchError={apiFetchError} />
      </div>
      <div id="Visualization" className="visualization">
        <Visualization />
      </div>
      <div id="Controls" className="controls">
        <form className="controls_search-form" onSubmit={onSubmitHandler}>
          <label className="controls_search-label" htmlFor="controls_search-input">
            <input
              ref={inputRef}
              className="controls_search-input"
              value={searchQuery}
              placeholder="Stadtname:"
              type="text"
              // onKeyDown={handleInputKeyboardEvent}
              onChange={handleSearchQueryInput}
              autoComplete="new-password"
            />
            <div className="controls_search-results">{parseSearchResult(searchResult)}</div>
          </label>
          <div className="controls_slider">
            <div className="controls_datetime-picker">
              <DateTimePicker
                value={date}
                disableClock
                clearIcon={null}
                onChange={(newDate: Date): void => setDate(newDate)}
                onKeyDown={onKeyDownHandler}
              />
            </div>
            <Slider
              marks={{
                [sunRise]: { style: sliderSunRiseStyles, label: 'Sunrise' },
                [sunSet]: { style: sliderSunSetStyles, label: 'Sunset' }
              }}
              value={timeInSec}
              min={0}
              max={86400}
              onChange={handleSlider}
            />
          </div>

          <input className="controls_submit-btn" type="submit" value="Submit" />
        </form>
      </div>
    </main>
  );
};

export default App;
