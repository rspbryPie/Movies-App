export default class MovieSevice {
  async getResource(url) {
    const res = await fetch(url);
    return await res.json();
  }
  async getAllMovies(page, query) {
    const res = await this.getResource(
      `https://api.themoviedb.org/3/search/movie?api_key=ddf2961f5278f0fb55f4a8faff9f8a15&language=en-US&query=${query}&page=${page}&include_adult=false`
    );
    if (res.results.length === 0) throw new Error('errror');
    console.log(res.results);
    return res;
    // return res.results;
  }
}

// 'https://api.themoviedb.org/3/search/movie?api_key=ddf2961f5278f0fb55f4a8faff9f8a15&language=en-US&query=return&page=1&include_adult=false'
