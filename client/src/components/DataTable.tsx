import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

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

interface DataTableProps {
  data?: DataType;
  isLoading: boolean;
  apiFetchError: boolean;
}

const dataStruct: { [key: string]: string } = {
  jd: 'Julian Day',
  dPsi: 'Delta Psi',
  dEpsilon: 'Delta Epsilon',
  epsilon: 'Epsilon',
  zenith: 'Zenith',
  azimuth: 'Azimuth',
  incidence: 'Incidence',
  sr: 'Sunrise',
  ss: 'Sunset'
};

const DataTable = (props: DataTableProps): JSX.Element => {
  const { data, isLoading, apiFetchError } = props;

  const dataStructKeys = Object.keys(dataStruct);

  const dataList = dataStructKeys.map(
    (key): JSX.Element => {
      return (
        <li key={key} className={`datatable_item-${key} datatable_item`}>
          <div className="datatable_item-header">
            <h5>{dataStruct[key]}</h5>
          </div>
          <div className="datatable_item-value">
            <div style={isLoading ? { display: 'none' } : {}} className={`${key}-value`}>
              {data ? data[key] : 0}
            </div>
            <div className="datatable_item-value--is-loading" style={!isLoading ? { display: 'none' } : {}}>
              <FontAwesomeIcon icon={faSpinner} pulse />
            </div>
          </div>
        </li>
      );
    }
  );
  if (apiFetchError) {
    return <div>Error at fetching, you need to start the Server</div>;
  }

  return (
    <div className="datatable_items">
      <div className="datatable_items-header">
        <h3>Daten</h3>
      </div>
      <ul className="datatable_items-data">{dataList}</ul>
    </div>
  );
};

export default DataTable;
