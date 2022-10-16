export default class MovieSevice {
  apiKey = 'ddf2961f5278f0fb55f4a8faff9f8a15';

  baseUrl = 'https://api.themoviedb.org/3/';
  async getResource(url) {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error('test error in get response');
    }
    return res.json();
  }

  async getAllMovies(page, query) {
    const res = await this.getResource(
      `${this.baseUrl}search/movie?api_key=${this.apiKey}&language=en-US&query=${query}&page=${page}&include_adult=false`
    );
    if (res.results.length === 0) throw new Error('errror');

    return res;
    // return res.results;
  }

  async getGenres() {
    try {
      const res = await this.getResource(
        `${this.baseUrl}genre/movie/list?api_key=${this.apiKey}`
      );
      return res;
    } catch (error) {
      console.log(`${error} in getData`);
    }
  }

  async getGuestSessionId() {
    try {
      const res = await this.getResource(
        `${this.baseUrl}authentication/guest_session/new?api_key=${this.apiKey}&language=en-US`
      );
      return res;
    } catch (error) {
      console.log(`${error} in getGuestSessionId`);
    }
  }

  saveGuestSessionId = () => {
    const availableToken = localStorage.getItem('guest_session_id');
    if (!availableToken) {
      this.getGuestSessionId()
        .then((res) => {
          let guestSessionId = res.guest_session_id;
          return guestSessionId;
        })
        .then((res) => localStorage.setItem('guest_session_id', res))
        .catch((err) => console.error(err));
    }
  };

  async getRatedMovies() {
    try {
      const token = localStorage.getItem('guest_session_id');
      const res = await this.getResource(
        `${this.baseUrl}guest_session/${token}/rated/movies?api_key=${this.apiKey}&language=en-US&sort_by=created_at.asc`
      );
      return res;
    } catch (error) {
      console.log(`${error} in getData`);
    }
  }
  setMovieRating = async (id, guestSessionToken, rate) => {
    console.log('id', id);
    const url = `${this.baseUrl}movie/${id}/rating?api_key=${this.apiKey}&guest_session_id=${guestSessionToken}`;
    const body = {
      value: rate,
    };
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify(body),
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Возникла проблема с fetch запросом: ', err.message);
    });
  };

  deleteRateMovie = async (id, guestSessionToken) => {
    console.log('id', id);
    const url = `${this.baseUrl}movie/${id}/rating?api_key=${this.apiKey}&guest_session_id=${guestSessionToken}`;
    const headers = {
      'Content-Type': 'application/json;charset=utf-8',
    };
    await fetch(url, {
      method: 'DELETE',
      headers,
    });
  };
}

// 'https://api.themoviedb.org/3/movie/47971/rating?api_key=ddf2961f5278f0fb55f4a8faff9f8a15&language=en-US&query=return&page=1&include_adult=false'
