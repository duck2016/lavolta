import React, { Component } from 'react';

const css = `
    *, *::before, *::after {
        box-sizing: border-box;
    }
    body, html {
        background-color: #c1e8f7;
        font-family: 'Open Sans', sans-serif;
        font-weight: 400;
        font-size: 13px;
    }
`;

export default class extends Component {
    static defaultProps = {
        manifest: {
            'main.js': '/assets/bundles/main.js'
        }
    };
    render() {
        const { manifest } = this.props;
        return (
            <html>
                <head>
                    <meta charSet="utf-8"/>
                    <title>cowinspace</title>
                    <style type="text/css" dangerouslySetInnerHTML={{ __html: css }}/>
                </head>
                <body>
                    <div id="root">
                        <div id="chat"/>
                        <input type="text" id="message"/>
                        <input type="submit" id="submit"/>
                        <div>
                            <canvas id="canvas" width="320" height="240"/>
                        </div>
                    </div>
                    <script src={manifest['main.js']}/>
                </body>
            </html>
        );
    };
};