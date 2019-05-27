import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as webmidi from 'webmidi';

import './main.css';

import { App } from './synth-ui/app';

const appRoot = document.getElementById('root') as HTMLElement;

webmidi.enable(function (err: string) {
    if (!!err) {
        appRoot.innerText = 'Web MIDI is not supported in this browser.';
        console.error(err);
    }
    else {
        ReactDOM.render(
            <App />,
            appRoot
        );
    }
});
