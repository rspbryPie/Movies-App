import React, { Component } from 'react';
import { debounce } from 'lodash';
import { Offline } from 'react-detect-offline';
import MovieSevice from '../../services/get-resource';
import { Alert, Pagination, Input, Tabs } from 'antd';
import ItemList from '../item-list';

import './app.css';

export default class App extends Component {
  movieService = new MovieSevice();

  state = {
    searchQuery: 'return',
    movieData: [],
    loading: true,
    error: false,
    err: {},
    currentPage: 1,
    totalPages: 1,
  };
  constructor() {
    super();
    this.updateMovies();
  }
  onMovieLoaded = (movie, totalPages, page, query = 'return') => {
    this.setState({
      searchQuery: query,
      movieData: movie,
      loading: false,
      error: false,
      totalPages,
      currentPage: page,
    });
  };
  onError = (err) => {
    this.setState({
      error: true,
      loading: false,
      err: err,
    });
  };
  updateMovies = (page = 1, query = this.state.searchQuery) => {
    this.movieService
      .getAllMovies(page, query)
      .then((res) =>
        this.onMovieLoaded(res.results, res.total_pages, page, query)
      )
      .catch(this.onError);
  };

  async searchQueryChange(searchQuery) {
    if (!searchQuery) return;
    this.setState({ searchQuery: searchQuery });
    await this.updateMovies(1, searchQuery);
  }
  resSearchQueryChange = debounce(this.searchQueryChange, 1000);
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  render() {
    const paginationChange = (page) => {
      this.updateMovies(page);
      // this.componentDidMount();
      window.scrollTo(0, 0);
    };
    console.log('пусто?', !(this.state.movieData.length === 0));
    const showTotal = (total) => `Total ${total} items`;
    const items = [
      {
        label: 'Tab 1',
        key: 'item-1',
        children: (
          <React.Fragment>
            <Input
              placeholder='Введите название фильма'
              onChange={(e) => this.resSearchQueryChange(e.target.value.trim())}
            />
            <Pagination
              current={this.state.currentPage}
              onChange={(page) => this.updateMovies(page)}
              size='small'
              total={this.state.totalPages}
              showTotal={showTotal}
              pageSize={1}
              showSizeChanger={false}
              hideOnSinglePage={true}
            />
            <ItemList
              err={this.state.err}
              error={this.state.error}
              loading={this.state.loading}
              movies={this.state.movieData}
            />
            {/* {!(this.state.movieData.length === 0) ? (
              <ItemList
                err={this.state.err}
                error={this.state.error}
                loading={this.state.loading}
                movies={this.state.movieData}
              />
            ) : (
              <>
                <Spin tip='Loading...' />
                <Alert
                  message='Упссс'
                  description='По вашему запросу ничего не найдено'
                  type='info'
                />
              </>
            )} */}

            <Pagination
              current={this.state.currentPage}
              onChange={paginationChange}
              size='small'
              total={this.state.totalPages}
              showTotal={showTotal}
              pageSize={1}
              showSizeChanger={false}
              hideOnSinglePage={true}
            />
          </React.Fragment>
        ),
      }, // remember to pass the key prop
      { label: 'Tab 2', key: 'item-2', children: 'Content 2' },
    ];

    console.log(this.state.currentPage);
    return (
      <div className='wrapper'>
        <Offline>
          <Alert
            message='Упссс'
            description='Проверьте пожалуйста ваше подключение к интернету'
            type='info'
          />
        </Offline>
        <Tabs
          style={{ width: '100%' }}
          items={items}
          centered={true}
          destroyInactiveTabPane={true}
        />
      </div>
    );
  }
}
