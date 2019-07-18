import React from 'react';

interface SPAObject {
  [key: string]: {
    [key: string]: string;
  };
}

const DataTable = (props: SPAObject): JSX.Element => {
  const { data } = props;

  const dataNames = Object.keys(data);

  const dataElements = dataNames.map(
    (key): JSX.Element => (
      <div key={key} className="datatable_element">
        <div className="datatable_element-header">
          <p>{key}:</p>
        </div>
        <div className="datatable_element-value">
          <p>{data[key]}</p>
        </div>
      </div>
    )
  );

  return (
    <div id="DataTable" className="datatable">
      <div className="datatable_elements">
        <div className="datatable_elements-header">
          <h3>Daten:</h3>
        </div>
        <div className="datatable_elements-data">{dataElements}</div>
      </div>
    </div>
  );
};

export default DataTable;
