import React from 'react';
import Item from '../item';
import { Spin, Alert } from 'antd';

import 'antd/dist/antd.dark.min.css';
import './item-list.css';

const ItemList = ({ movies, loading, error, err }) => {
  const list = movies.map((item) => {
    return <Item key={item.id} item={item} />;
  });

  const hasData = !(loading || error);
  const spinner =
    loading || list.length === 0 ? <Spin tip='Loading...'></Spin> : null;
  const content = hasData ? <ul className='items-list'>{list}</ul> : null;

  const errorMessage = error ? (
    <Alert message={err.name} description={err.message} type='info' />
  ) : null;
  console.log(list.length === 0);
  return (
    <div className='container'>
      {errorMessage}
      {spinner}
      {content}
    </div>
  );
};

export default ItemList;
