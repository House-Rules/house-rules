import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AddAlternate from '../components/AddAlternate';

export default class SingleGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      game: {},
      alternates: []
    }
    this.arrowToggle = this.arrowToggle.bind(this);
  }

  arrowToggle() {
    var backArrow = document.getElementById('myArrow');

    if (backArrow.className === "material-icons") {
      backArrow.className += " rotate";
    } else {
      backArrow.className = "material-icons";
    }
  }

  toggleReadMore = () => {
    let gameRules = document.getElementById('game_rules');
    let readMore = document.getElementById('read_more');

    if (gameRules.style.height === "auto") {
      gameRules.style.height = "12rem";
      gameRules.style.transition = "height 0.5s";
      readMore.textContent = "Read more";
    } else {
      gameRules.style.height="auto";
      gameRules.style.transition = 'height 0.5s';
      readMore.textContent = "Read Less";
    }
  }

  handleDeleteGame = (gameId) => {

    fetch(`https://house-rules-jgwrbs.herokuapp.com/api/game/${gameId}/delete`, {
      method: "DELETE"
    })
    .then(response => {
      console.log("DELETE SUCCESSFUL: ", response);
    })
    .catch(error => {
      console.log("Failure to delete: ", error);
    })

    this.props.history.push('/house-rules/games');

  }

  handleDeleteHouseRules = (gameId, rulesId) => {

    fetch(`https://house-rules-jgwrbs.herokuapp.com/api/game/${gameId}/alternate/${rulesId}/delete`, {
      method: "DELETE"
    })
    .then(response => {
      console.log("DELETE SUCCESSFUL: ", response);
    })
    .catch(error => {
      console.log("FAILURE TO DELETE: ", error);
    })
    // push??
  }

  componentDidMount() {
    let match = this.props.match;
    const id = match.params.id;
    const URL = `https://house-rules-jgwrbs.herokuapp.com/api/game/${id}`;

    fetch(URL)
    .then(response => {
      return response.json()
    })
    .then(data => {
      this.setState({game: data, alternates: data.alternates})
    })
  }

  render() {
    let game = this.state.game;
    let gameCategory = this.state.game.category;
    let gameIcon;

    switch (gameCategory) {
      case "card":
        gameIcon = 'style';
        break;
      case "board":
        gameIcon = 'dashboard';
        break;
      case "dice":
        gameIcon = 'casino';
        break;
      case "recreational sports":
        gameIcon = "golf_course";
        break;
      default:
        gameIcon = "widgets"
    }

    let alternatesList = this.state.alternates.map((game) => {
      return (
        <div className="each_alternate card-block" key={game.id}>
          <div className="alt_game_label">
            <div className="initial_container">
              <h3 className="alternate_initial">
                <img src={require('../images/house-rules-white.png')} alt="#"/>
              </h3>
            </div>
            <div className="title_container">
              <h4 className="alternate_title">{game.title}</h4>
            </div>

            <button className='btn arrowButton2' data-toggle="collapse" data-target={"#" + game.id}><i className="material-icons" id="myArrow">expand_more</i></button>
          </div>

          <div id={game.id} className="collapse alt_rules">

            <Link to="#" id="delete_rules_button" className="btn" onClick={() => this.handleDeleteHouseRules(`${this.state.game.id}`, `${game.id}`)}><i className="material-icons">delete</i></Link>

            <div>
              <h5 className="game_labels">Objective</h5>
              <h4>{game.objective}</h4>
              <h5 className="game_labels">New Rules</h5>
              <p>{game.rules}</p>
            </div>
          </div>

        </div>
      )
    })

    return (
      <div className="singleGame">
        <div className='card card-block'>
          <div className="title_block">

            <div>
              <h2 className='card-title alert'>{game.title}</h2>
            </div>

            <div className="arrow_container">
              <Link to='/house-rules/games'>
                <i className="material-icons md-36">arrow_back</i>
              </Link>
            </div>

          </div>

          <div className='alert icon_bar'>

            <div>
              <i className="material-icons group" id={game.category}>{gameIcon}</i>
              <p>Category</p>
              <p>{game.category}</p>
            </div>

            <div>
              <i className="material-icons group">group</i>
              <p>Players</p>
              <p className=''>{game.numberOfPlayers}</p>
            </div>

            <div>
              <i className="material-icons face">face</i>
              <p>Ages</p>
              <p className=''>{game.playerAgeRange}</p>
            </div>

          </div>

          <div className='alert game_objective'>
            <h5>How to Win</h5>
            <p>{game.objective}</p>
          </div>

          <div className='house_rules alert normal_rules'>
            <div>
              <h4>Traditional rules</h4>
              <a className="alt_games_link" href="#altGamesList">...how about a different spin on the game?</a>
            </div>
          </div>

          <p id="game_rules">{game.rules}</p>
          <div className="read_more" id="read_more" onClick={() => this.toggleReadMore()}>Read more</div>

          <button className='btn arrowButton' data-toggle="collapse" data-target="#demo"onClick={this.arrowToggle}>Add Rules<i className="material-icons" id="myArrow">add</i></button>

          <div id="demo" className="collapse">
            <AddAlternate game={this.state.game} history={this.props.history} arrowToggle={() => this.arrowToggle()} />
          </div>

          <div id="altGamesList">
            <h3 className="alt_list_header">{this.state.alternates.length === 0 ? 'Be the first to add House Rules for this game' : 'House Rules'}</h3>

              {alternatesList}

          </div>

        </div>

        {/*add this back in the delete_button after demo---
          onClick={() => this.handleDeleteGame(`${game.id}`)}*/}

        <Link to="#" id="delete_button" className="btn" ><i className="material-icons">delete</i></Link>

        <div>
          <a href='#myNavBar'>
            <i className="material-icons md-36 top_arrow">arrow_upward</i>
          </a>
        </div>

      </div>
    );
  }
};
