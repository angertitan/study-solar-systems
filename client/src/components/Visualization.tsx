import React from 'react';

interface BaseObject {
  [key: string]: {}[];
}

const Visualization = (props: BaseObject): JSX.Element => {
  const { data } = props;

  console.log(data);
  return (
    <div id="Visualization" className="visualization">
      <div className="visualization-header">Vis</div>
    </div>
  );
};

export default Visualization;
