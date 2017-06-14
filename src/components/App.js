import React, { Component } from 'react';
import goorl from 'goorl';
import CopyToClipboard from 'react-copy-to-clipboard';
import _ from 'lodash';
import '../styles/App.css';
import url from '../images/url.png';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            url: '',
            copied: false,
            links: [],
            error: false,
            errorMessage: '',
            inputChange: false,
            existingUrl: false,
            linkCreated: false,
        };

        this.onInputChange = this.onInputChange.bind(this)
        this.onFormSubmit = this.onFormSubmit.bind(this)
    }

    onInputChange(event) {
        this.setState({ 
            url: event.target.value,
            inputChange: true,
            error: false,
            copied: false,
            linkCreated: false,
        });
    }

    onFormSubmit(event) {
        event.preventDefault();

        this.setState({ 
            url: this.state.url,
        });
        this.shortenedUrl()
    }

    shortenedUrl() {
        const options = {
            key: 'AIzaSyA1S6ouEltuljsFOU8oeje3vno2UqONtqY',
            url: this.state.url
        }
        goorl(options, (error, url) => {
            if (error) {
                this.setState({
                    error: true,
                    existingUrl: false,
                    errorMessage: 'Unable to create short URL, enter valid URL'
                })
            } 
            else if(_.includes(this.state.links, url)) {
                this.setState({
                    existingUrl: true,
                })
            }
            else {
                this.setState((prevState) => ({
                    links: prevState.links.concat([url]).reverse(),
                    linkCreated: true,
                    error: false,
                    existingUrl: false
                }));
            }
        })
    }

    errorMessage(message) {
        return (
            <div className="message error-message">
                 <span>{message}</span>
            </div>
        )
    }

    takeMeToUrl(link) {
        window.open(link)
        return false
    }

    createButton(link) {
        return (
            <div className="buttons">
                <button className="button-open" onClick={() => {this.takeMeToUrl(link)}} title="Open"></button>
                <CopyToClipboard text={link} onCopy={() => this.setState({copied: true})}>
                    <button className="button-copy" title="Copy"></button>
                </CopyToClipboard>
            </div>
        )
    }

    renderLink() {
        return this.state.links.map((link, i) => {
            return (
                <li key={link+'-'+i}>
                    {link}
                    {this.createButton(link)}
                </li>
            );
        });
    }

    render() {
        return (
            <div className="shortenUrl-bar">
                {this.state.error ? this.errorMessage(this.state.errorMessage) : ''}
                {this.state.existingUrl ? this.errorMessage('This URL already exists') : ''}
                <div className="header">
                    <img src={url} id="logo" alt="URL Shortener" className={this.state.linkCreated ? 'rotate' : ''}/>
                    <span>URL Shortener</span>
                </div>
                <form onSubmit={this.onFormSubmit}>
                    <input 
                        placeholder="Your original URL here"
                        className="form-control"
                        value={this.state.url} 
                        onChange={this.onInputChange} />
                    <span className="input-btn">
                        <button type="submit" className="btn btn-secondary">SHORTEN URL</button>
                    </span>
                </form>
                <div className="new-url">
                    <ul>
                        {this.renderLink()}
                    </ul>
                </div>
            </div>
        );
    }
}

export default App;