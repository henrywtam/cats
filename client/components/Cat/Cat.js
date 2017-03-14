import React from 'react';
import styles from './CatStyles.css.js';
// import StyleSheet from 'react-style'; // couldn't figure out this package :/

export default class Cat extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			id: this.props.id,
			fact: this.props.fact,
			srcUrl: this.props.srcUrl,
			url: this.props.url,
			handleRemoveCat: this.props.handleRemoveCat
		};
	}

	render() {
		const {id, url, fact, handleRemoveCat} = this.state;
		return (
			<div>
				<div style={styles.catProfile}>
					<div style={styles.deleteIcon} onClick={handleRemoveCat} data-cat-id={id}>X</div>
					<div style={styles.catName}>Cat {id}</div>
					<div style={styles.picContainer}>
						<img style={styles.catPic} src={url}/>
					</div>
					<div style={styles.catFact}>{fact}</div>
				</div>
			</div>
		);
	}
}