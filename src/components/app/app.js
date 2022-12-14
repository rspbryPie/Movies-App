import React, { Component } from 'react'
import { debounce } from 'lodash'
import { Offline } from 'react-detect-offline'
import { Alert, Pagination, Input, Tabs } from 'antd'

import MovieSevice from '../../services/get-resource'
import { Context } from '../genres-context/genres-context'
import ItemList from '../item-list'

import './app.css'

export default class App extends Component {
  movieService = new MovieSevice()

  state = {
    ratedFilm: [],
    guestSessionId: '',
    genresList: [],
    searchQuery: 'return',
    movieData: [],
    loading: true,
    error: false,
    err: {},
    currentPage: 1,
    totalPages: 1,
  }

  resSearchQueryChange = debounce(this.searchQueryChange, 1000)

  componentDidMount() {
    if (!localStorage.getItem('guest_session_id')) {
      this.startGuestSession()
    } else {
      this.setState({
        guestSessionId: localStorage.getItem('guest_session_id'),
      })
    }
    this.getGenres()
    this.updateMovies()
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error(info.componentStack)
  }

  onMovieLoaded = (movie, totalPages, page, query = 'return') => {
    this.setState({
      searchQuery: query,
      movieData: movie,
      loading: false,
      error: false,
      totalPages,
      currentPage: page,
    })
  }

  onError = (err) => {
    this.setState({
      error: true,
      loading: false,
      err,
    })
  }

  updateMovies = (page = 1, query = this.state.searchQuery) => {
    this.movieService
      .getAllMovies(page, query)
      .then((res) => this.onMovieLoaded(res.results, res.total_pages, page, query))
      .catch(this.onError)
  }

  getGenres = () => {
    this.movieService
      .getGenres()
      .then((res) => {
        this.setState({ genresList: res.genres })
      })
      .catch(this.onError)
  }

  startGuestSession = () => {
    this.movieService.saveGuestSessionId()
  }

  getRatedMovies = () => {
    const { guestSessionId, currentPage } = this.state
    this.movieService
      .getRatedMovies(guestSessionId, currentPage)
      .then((item) => {
        this.setState({
          ratedFilm: item.results,
        })
      })
      .catch(() => {
        this.setState({
          loading: false,
          error: true,
        })
      })
  }

  async searchQueryChange(searchQuery) {
    if (searchQuery === '') return
    this.setState({ searchQuery })
    await this.updateMovies(1, searchQuery)
  }

  render() {
    const paginationChange = (page) => {
      this.updateMovies(page)
      window.scrollTo(0, 0)
    }

    const showTotal = (total) => `Total ${total} items`
    const items = [
      {
        label: 'Search',
        key: 'item-1',
        children: (
          <>
            <Input
              placeholder="?????????????? ???????????????? ????????????"
              onChange={(e) => this.resSearchQueryChange(e.target.value.trim())}
            />
            <Pagination
              current={this.state.currentPage}
              onChange={(page) => this.updateMovies(page)}
              size="small"
              total={this.state.totalPages}
              showTotal={showTotal}
              pageSize={1}
              showSizeChanger={false}
              hideOnSinglePage
            />
            <Context.Consumer>
              {(genresList) => (
                <ItemList
                  guestSessionId={this.state.guestSessionId}
                  genres={genresList}
                  err={this.state.err}
                  error={this.state.error}
                  loading={this.state.loading}
                  movies={this.state.movieData}
                />
              )}
            </Context.Consumer>

            <Pagination
              current={this.state.currentPage}
              onChange={paginationChange}
              size="small"
              total={this.state.totalPages}
              showTotal={showTotal}
              pageSize={1}
              showSizeChanger={false}
              hideOnSinglePage
            />
          </>
        ),
      },
      {
        label: 'Rated',
        key: 'item-2',
        children: (
          <Context.Consumer>
            {(genresList) => (
              <ItemList
                guestSessionId={this.state.guestSessionId}
                genres={genresList}
                err={this.state.err}
                error={this.state.error}
                loading={this.state.loading}
                movies={this.state.ratedFilm}
              />
            )}
          </Context.Consumer>
        ),
      },
    ]

    return (
      <div className="wrapper">
        <Offline>
          <Alert message="??????????" description="?????????????????? ???????????????????? ???????? ?????????????????????? ?? ??????????????????" type="info" />
        </Offline>
        <Context.Provider value={this.state.genresList}>
          <Tabs
            style={{ width: '100%' }}
            items={items}
            centered
            destroyInactiveTabPane
            onChange={(e) => {
              if (e === 'item-2') this.getRatedMovies()
            }}
          />
        </Context.Provider>
      </div>
    )
  }
}
