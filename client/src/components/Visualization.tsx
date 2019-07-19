import React from 'react';

interface BaseObject {
  [key: string]: {}[];
}

const Visualization = (props: BaseObject): JSX.Element => {
  const { data } = props;
  return <div className="visualization-header" />;
};

export default Visualization;
