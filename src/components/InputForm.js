import React, { Component } from 'react';
import PubSub from 'pubsub-js';

class InputForm extends Component{
	constructor() {
    	super();
    	this.state = {errorMsg:''};
  	}
	render() {
		return(
			<div className="pure-control-group" style={{ display: 'flex', justifyContent: 'center', marginLeft: '10px' }}>
    	      	<label htmlFor={this.props.id}>{this.props.label}</label>
    	      	<input id={this.props.id} name={this.props.name} value={this.props.value} type={this.props.type} onChange={this.props.onChange}/>
				<span className="error">{this.state.errorMsg}</span>
    	    </div>
		);
	}

	componentDidMount(){
		PubSub.subscribe('reporting-validation-error',function(topic,newError){
			if(this.props.value === ''){
				this.setState({errorMsg:newError});
			}
  		}.bind(this));
	}
}

export default InputForm;