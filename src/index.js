import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './css/pure-min.css';
import './css/side-menu.css';
import Home from './Home';
import Kind from './Kind';
import ContactBox from './Contact';
import { BrowserRouter as Router, Route, Link} from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
	(<Router>
		<div>
			<div id="layout">        
            	<div id="menu">
            	    <div className="pure-menu">
            	        <a className="pure-menu-heading">Biblioteca</a>
            	        <ul className="pure-menu-list">  
            	              <li className="pure-menu-item">
            	                <Link to="/" className="pure-menu-link">Home</Link>
            	              </li>
            	              <li className="pure-menu-item">
            	                <Link to="/kind" className="pure-menu-link">Kinds</Link>
            	              </li>
            	              <li className="pure-menu-item">
            	                <Link to="/contact" className="pure-menu-link">Contacts</Link>
            	              </li>
            	        </ul>
            	   	</div>
          		</div>
        	</div>
			<Route exact path="/" component={Home}/>
			<Route path="/kind" component={Kind}/>
			<Route path="/contact" component={ContactBox}/>
		</div>	
	</Router>), document.getElementById('root'));
registerServiceWorker();
