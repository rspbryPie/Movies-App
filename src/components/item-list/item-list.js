import React from 'react'
import { Spin, Alert } from 'antd'

import Item from '../item'

import 'antd/dist/antd.dark.min.css'
import './item-list.css'

function ItemList({ guestSessionId, genres, movies, loading, error, err }) {
  const list = movies.map((item) => <Item guestSessionId={guestSessionId} genres={genres} key={item.id} item={item} />)

  const hasData = !(loading || error)
  const spinner = loading || list.length === 0 ? <Spin tip="Loading..." /> : null
  const content = hasData ? <ul className="items-list">{list}</ul> : null

  const errorMessage = error ? <Alert message={err.name} description={err.message} type="info" /> : null

  return (
    <div className="container">
      {errorMessage}
      {spinner}
      {content}
    </div>
  )
}

export default ItemList
