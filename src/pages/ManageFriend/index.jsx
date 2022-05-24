import React from 'react';
import { render } from 'react-dom';

import ManageFriend from './ManageFriend';
import '../../styles/tailwind.css';

render(<ManageFriend />, window.document.querySelector('#app-container'));
