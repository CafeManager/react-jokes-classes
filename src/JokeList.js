import React from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

class JokeList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { jokes: [], numJokesToGet: props.numJokesToGet };
        this.jokes = [];
        this.getJokes = this.getJokes.bind(this);
        this.resetJokes = this.resetJokes.bind(this);
        this.vote = this.vote.bind(this);
        this.sort = this.sort.bind(this);
    }
    componentDidMount() {
        this.getJokes();
    }

    async getJokes() {
        let j = [...this.jokes];
        let seenJokes = new Set();
        try {
            while (j.length < this.props.numJokesToGet) {
                let res = await axios.get("https://icanhazdadjoke.com", {
                    headers: { Accept: "application/json" },
                });
                let { status, ...jokeObj } = res.data;

                if (!seenJokes.has(jokeObj.id)) {
                    seenJokes.add(jokeObj.id);
                    j.push({ ...jokeObj, votes: 0 });
                } else {
                    console.error("duplicate found!");
                }
            }
            this.setState({ jokes: j });
        } catch (e) {
            console.log(e);
        }
    }

    resetJokes() {
        this.jokes = [];
        this.getJokes();
    }

    vote(id, delta) {
        const jokes = this.state.jokes.map((j) => {
            return j.id === id ? { ...j, votes: j.votes + delta } : j;
        });

        this.sort(jokes);
    }

    sort(arr) {
        let sortedJokes = [...arr].sort((a, b) => b.votes - a.votes);
        this.setState({ jokes: sortedJokes });
    }
    render() {
        return (
            <div className="JokeList">
                <button className="JokeList-getmore" onClick={this.resetJokes}>
                    Get New Jokes
                </button>

                {this.state.jokes.map((j) => (
                    <Joke
                        text={j.joke}
                        key={j.id}
                        id={j.id}
                        votes={j.votes}
                        vote={this.vote}
                    />
                ))}
            </div>
        );
    }
}

export default JokeList;
