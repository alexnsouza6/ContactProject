import React, { Component } from 'react';

class FormButton extends Component{
	render(){
		return (
			<div className="pure-control-group">
              <div style={{ display: 'flex', justifyContent: 'center', marginLeft:'150px' }}>
                <button type={this.props.type} className="pure-button pure-button-primary">Salvar</button>
              </div>
            </div>
		);
	}
}

export default FormButton;