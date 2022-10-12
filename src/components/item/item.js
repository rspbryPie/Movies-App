import React, { Component } from 'react';
import { format } from 'date-fns';

import './item.css';

export default class Item extends Component {
  get shortOverview() {
    const maxLength = 28;
    const shortOverview = this.props.item.overview.split(' ');
    if (shortOverview.length >= maxLength) {
      shortOverview.length = maxLength;
      shortOverview.push('...');
    }
    return shortOverview.join(' ');
  }

  get shortTitle() {
    const maxLength = 22;
    const shortTitle = this.props.item.title.slice(0, 26).split('');
    if (shortTitle.length > maxLength) {
      shortTitle.length = maxLength;
      shortTitle.push('...');
    }
    return shortTitle.join('');
  }
  get formattedReleaseDate() {
    const dateString = this.props.item.release_date;
    if (!dateString) return undefined;
    const date = new Date(dateString);
    return format(date, 'MMMM d, Y');
  }
  render() {
    return (
      <li key={this.props.item.id} className='item'>
        <img
          src={
            !this.props.item.poster_path
              ? 'https://wcinema.ru/upload/000/u1/4/2/subbotnii-vecher-na-okraine-goroda-photo-big.jpg'
              : `https://image.tmdb.org/t/p/original${this.props.item.poster_path}`
          }
          alt='нет картинки'
        />
        <div className='item-info'>
          <h1>{this.shortTitle}</h1>
          <h3>{this.formattedReleaseDate}</h3>
          <span>Жанр</span>
          <p className='description'>{this.shortOverview}</p>
          <div className='item-ranking'>Р</div>
        </div>
      </li>
    );
  }
}
