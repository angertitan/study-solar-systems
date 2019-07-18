import React from 'react';

interface DataTableProps {
  data: {
    [key: string]: string;
  };
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
        <li key={key} className={`datatable-item ${key}`}>
          <div className={`${key}-header`}>
            <h5>{dataStruct[key]}</h5>
          </div>
          <h6 className={`${key}-value`}>{data[key] || ''}</h6>
        </li>
      );
    }
  );
  if (apiFetchError) {
    return <div>Error at fetching, you need to start the Server</div>;
  }

  const loadingIndicator = !isLoading
    ? ''
    : (): JSX.Element => <div className="datable_items-header--loading-indicator" />;

  return (
    <div className="datatable_items">
      <div className="datatable_items-header">
        <h3>Daten:</h3>
        {loadingIndicator}
      </div>
      <ul className="datatable_items-data">{dataList}</ul>
    </div>
  );
};

export default DataTable;
