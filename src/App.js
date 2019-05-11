import React, { Component } from 'react';
import logo from './static/logo.svg';
import './App.css';
import 'typeface-roboto';
import PrimarySearchAppBar from './components/AppBar';
import TitlebarGridList from './components/TitlebarGridList';
import { Route } from 'react-router-dom'

import bookLogo from './static/images/library.svg';
import authorLogo from './static/images/writer.svg';
import bookAvailableCopiesLogo from './static/images/books.svg';
import bookCopiesLogo from './static/images/bookCopies.svg';
import genreLogo from './static/images/genre.svg';

class App extends Component {
  constructor(props) {
    super(props);
    this.tileData = {
        book : {
              img: bookLogo,
              title: 'Book',
              count: 0,
            },
        copies : {
              img: bookCopiesLogo,
              title: 'Copies',
              count: 0,
            },
        copiesAvailable : {
              img: bookAvailableCopiesLogo,
              title: 'Copies Available',
              count: 0,
            },
        author : {
              img: authorLogo,
              title: 'Authors',
              count: 0,
            },
        genre : {
              img: genreLogo,
              title: 'Genres',
              count: 0,
            }
    };
  this.state = {
    tileData : this.tileData
  };

    this.getDBCount();
  }


  // our first get method that uses our backend api to 
  // fetch data from our data base
  getDBCount = () => {
    fetch("http://localhost:3001/")
      .then(data => data.json())
      .then(res => {
          // console.log(res);
          let newTileData = this.tileData;
          newTileData.book.count = res.data.book_count;
          newTileData.copies.count = res.data.book_instance_count;
          newTileData.copiesAvailable.count = res.data.book_instance_available_count;
          newTileData.author.count = res.data.author_count;
          newTileData.genre.count = res.data.genre_count;
          this.setState({ tileData : newTileData });
          }
      )
  };

  render() {
    const state = this.state;

    return (
      <div className="App">
        <PrimarySearchAppBar />
        <Route
          exact path='/'
          render={(props) => <TitlebarGridList {...props} tileData={state.tileData} />}
        />
        <Route
          exact path='/catalog'
          render={(props) => <TitlebarGridList {...props} tileData={state.tileData} />}
        />
        <Route
          exact path='/catalog/authors'
          render={(props) => <TitlebarGridList {...props} tileData={state.tileData} />}
        />
        <Route
          exact path='/catalog/books'
          render={(props) => <TitlebarGridList {...props} tileData={state.tileData} />}
        />
        <Route
          exact path='/catalog/genres'
          render={(props) => <TitlebarGridList {...props} tileData={state.tileData} />}
        />
        <Route
          exact path='/catalog/bookinstances'
          render={(props) => <TitlebarGridList {...props} tileData={state.tileData} />}
        />
        <Route
          exact path='/catalog/author/create'
          render={(props) => <TitlebarGridList {...props} tileData={state.tileData} />}
        />
        <Route
          exact path='/catalog/genre/create'
          render={(props) => <TitlebarGridList {...props} tileData={state.tileData} />}
        />
        <Route
          exact path='/catalog/book/create'
          render={(props) => <TitlebarGridList {...props} tileData={state.tileData} />}
        />
        <Route
          exact path='/catalog/bookinstance/create'
          render={(props) => <TitlebarGridList {...props} tileData={state.tileData} />}
        />

        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}


export default App;
