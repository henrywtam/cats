import React from 'react';
import xml2js from 'xml2js';
import axios from 'axios';
import Cat from '../Cat/Cat';

export default class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			initialized: false,
			catPictures: new Array(),
			catFacts: new Array(),
			catWall: new Array(),
			allCats: new Map(),
			availableCats: new Map(),
			availableCatIds: new Array()
		};

	}

	initCats() {
		var self = this,
			pics = this.state.catPictures,
			facts = this.state.catFacts;

		// initialize cats when you have all the required data
		if (pics.length > 0 && facts.length > 0) {
			this.state.initialized = true;

			var allCats = new Map(),
				availableCats = new Map(),
				availableCatIds = [];

			pics.forEach(function(value, index) {
				var cat = <Cat
					key = {value.id[0]}
					id = {value.id[0]}
					fact = {facts[index]}
					srcUrl = {value.source_url[0]}
					url = {value.url[0]}
					handleRemoveCat = {self.handleRemoveCat.bind(self, value.id[0])}
				/>;
				allCats.set(value.id[0], cat);
				availableCats.set(value.id[0], cat);
				availableCatIds.push(value.id[0]);
			});
			this.setState({
				allCats: allCats,
				availableCats: availableCats,
				availableCatIds: availableCatIds
			});
		}
	}

	handleRemoveCat(id) {
		var availableCatIds = this.state.availableCatIds,
			availableCats = this.state.availableCats,
			catWall = this.state.catWall;

		availableCatIds.push(id);
		availableCats.set(id, this.state.allCats.get(id));

		catWall.forEach(function(cat, index) {
			if (cat.props.id === id) {
				catWall.splice(index, 1);
				return;
			}
		});

		this.setState({
			catWall: catWall,
			availableCats: availableCats,
			availableCatIds: availableCatIds
		});
	}

	addCat() {
		// TODO: improve error messaging
		if (this.state.catFacts.length === 0 || this.state.catPictures.length === 0) {
			console.log('You are missing cat pictures or facts');
			return;
		}
		var availableCats = this.state.availableCats,
			availableCatIds = this.state.availableCatIds,
			catWall = this.state.catWall;

		if (availableCats.size > 0) {
			var rng = Math.floor(Math.random() * availableCats.size) + 1,
				id = availableCatIds[rng],
				cat = availableCats.get(id);

			if (!cat) {
				console.log('Could not find a cat');
				return;
			}

			availableCats.delete(id);
			availableCatIds.splice(rng, 1);
			catWall.push(cat);
		} else {
			console.log('No more cats :(');
			return;
		}

		this.setState({
			availableCats: availableCats,
			availableCatIds: availableCatIds,
			catWall: catWall
		});
	}

	componentWillMount() {
		// TODO: improve error messaging
		var self = this;

		axios.get('http://mapd-cats.azurewebsites.net/catpics')
			.then(function(response) {
				// var catIdToCatPicUrlMap = new Map();
				var parseString = xml2js.parseString;
				parseString(response.data, function(err, result) {
					var catPictures = [],
						images = result.response.data[0].images[0].image;
					for (var img of images) {
						catPictures.push(img);
					}
					self.setState({catPictures: catPictures});
					self.initCats();
				});
			})
			.catch(function (error) {
				console.log(error);
			});

		axios.get('http://mapd-cats.azurewebsites.net/catfacts')
			.then(function(response){
				var catFacts = response.data.facts;
				self.setState({catFacts: catFacts});
				self.initCats();
			})
			.catch(function (error) {
				console.log(error);
			});
	}

	render() {
		const {catWall} = this.state;
		return (
			<div style={{textAlign: 'center'}}>
				<button onClick={this.addCat.bind(this)}>Add Cat</button>
				{catWall}
			</div>
		);
	}
}