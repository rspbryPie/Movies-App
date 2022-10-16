import React, { Component } from 'react';
import { format } from 'date-fns';
import { Rate } from 'antd';
import MovieSevice from '../../services/get-resource';

import './item.css';

export default class Item extends Component {
  state = {
    ratingValue: localStorage.getItem(`${this.props.item.id}`) || 0,
  };
  getShortOverview = () => {
    const maxLength = 28;
    const shortOverview = this.props.item.overview.split(' ');
    if (shortOverview.length >= maxLength) {
      shortOverview.length = maxLength;
      shortOverview.push('...');
    }
    return shortOverview.join(' ');
  };

  getShortTitle = () => {
    const maxLength = 20;
    const shortTitle = this.props.item.title.slice(0, 22).split('');
    if (shortTitle.length > maxLength) {
      shortTitle.length = maxLength;
      shortTitle.push('...');
    }
    return shortTitle.join('');
  };
  getFormattedReleaseDate = () => {
    const dateString = this.props.item.release_date;
    if (!dateString) return undefined;
    const date = new Date(dateString);
    return format(date, 'MMMM d, Y');
  };

  getGenreList() {
    const genres = this.props.item.genre_ids.map((genreId) => {
      const genre = this.props.genres.find((genre) => genre.id === genreId);
      return genre.name;
    });
    return genres;
  }

  setMovieRating = (rate) => {
    const { guestSessionId, item } = this.props;
    const { id } = item;
    const movieService = new MovieSevice();
    this.setState({
      ratingValue: rate,
    });
    if (rate === 0) movieService.deleteRateMovie(id, guestSessionId);
    movieService.setMovieRating(id, guestSessionId, rate);
    localStorage.setItem(`${id}`, `${rate}`);
  };

  render() {
    const genre = this.getGenreList();
    const newGenre =
      genre.length > 3 ? genre.slice(0, 4).join(', ') : genre.join(', ');

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
          <h1>{this.getShortTitle()}</h1>
          <h3>{this.getFormattedReleaseDate()}</h3>
          <span>{newGenre}</span>
          <p className='description'>{this.getShortOverview()}</p>
          <div
            className='item-ranking'
            style={{
              border:
                this.props.item.vote_average <= 3
                  ? '2px solid #E90000'
                  : 3 < this.props.item.vote_average &&
                    this.props.item.vote_average <= 5
                  ? '#2px solid E97E00'
                  : 5 < this.props.item.vote_average &&
                    this.props.item.vote_average <= 7
                  ? '2px solid #E9D100'
                  : '2px solid #66E900',
            }}
          >
            {this.props.item.vote_average.toFixed(1)}
          </div>
          <Rate
            value={this.state.ratingValue}
            count={10}
            onChange={(rate) => {
              this.setMovieRating(rate);
            }}
          />
        </div>
      </li>
    );
  }
}
