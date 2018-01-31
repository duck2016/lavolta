import React, { Component } from 'react';

const css = `
    *, *::before, *::after {
        box-sizing: border-box;
    }
    body, html {
        background-color: #c1e8f7;
        font-family: sans-serif;
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
        const { manifest, user } = this.props;
        return (
            <html>
                <head>
                    <meta charSet="utf-8"/>
                    <title>cowinspace</title>
                    <style type="text/css" dangerouslySetInnerHTML={{ __html: css }}/>
                </head>
                <body>
                    <div id="root">
                        <div>welcome {user.userId}</div>
                        <a href="/logout">logout</a>
                    </div>
                    <script dangerouslySetInnerHTML={{ __html: `window.__userId = '${user.userId}';` }}/>
                    <script src={manifest['main.js']}/>
                </body>
            </html>
        );
    };
};