import React, { Component } from 'react';
import './Deck.css'
import axios from 'axios';
import Card from './Card'
const API_BASE_URL = "https://deckofcardsapi.com/api/deck";

export default class Deck extends Component {
    constructor(props) {
        super(props)

        this.state = {
            deck: {},
            drawn: []
        }
        this.getCard = this.getCard.bind(this)
        this.removeCard = this.removeCard.bind(this)
    }

    async getCard() {
        //make request using deck id
        try {
            let deck_id = this.state.deck.deck_id;
            let cardUrl = `${API_BASE_URL}/${deck_id}/draw`;
            let cardRes = await axios.get(cardUrl);
            if (cardRes.data.remaining === 0) {
                throw new Error('No card remaining')
            }
            console.log(cardRes.data.remaining);
            let card = cardRes.data.cards[0]
            this.setState(st => ({
                drawn: [
                    ...st.drawn,
                    {
                        id: card.code,
                        image: card.image,
                        name: `${card.value} of ${card.suit}`
                    }
                ]
            }))
        } catch (e) {
            alert(e)
        }
    }

    async componentDidMount() {
        let deck = await axios.get(`${API_BASE_URL}/new/shuffle/`);
        this.setState({
            deck: deck.data,
        })
    }

    removeCard(id) {
        this.setState({
            drawn: this.state.drawn.filter(card => card.id !== id)
        })
    }

    render() {
        const cards = this.state.drawn.map(c => (
            <Card
                key={c.id}
                name={c.name}
                image={c.image}
                id={c.id}
                removeCard={this.removeCard}
            />
        ))
        return <div className='Deck'>
            <h1 className='Deck-title'>Card Dealer</h1>
            <h2 className='Deck-title subtitle'>A little demo made with React</h2>
            <button className="Deck-btn" onClick={this.getCard}>Get Card</button>
            <div className='Deck-cardarea'>
                {cards}
            </div>
        </div>;
    }
}
