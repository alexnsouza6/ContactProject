import React,{Component} from 'react';
import InputForm from './components/InputForm.js';
import FormButton from './components/FormButton.js';
import PubSub from 'pubsub-js';
import $ from 'jquery';
import ErrorFinder from './ErrorFinder.js'

class KindForm extends Component{
	constructor(){
		super();
		this.state = {description:''};
    this.setDescription = this.setDescription.bind(this);
    this.enviaForm = this.enviaForm.bind(this);
	}

	render(){
		return(
			<div className="pure-form pure-form-aligned" >
        		<form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method='post'>
        		  <InputForm id="description" name="description" value={this.state.description} type="text" onChange={this.setDescription} label="Description" />
        		  <FormButton type="submit"/>
        		</form>
      		</div>
		);
	}

	enviaForm(evento){
    	evento.preventDefault();
    	$.ajax({
    	    url:"http://localhost:8080/kinds",
    	    contentType: 'application/json',
    	    dataType: 'json',
    	    type:'POST',
    	    data: JSON.stringify({description:this.state.description}),
    	    success:function(newList){
    	      PubSub.publish('refreshing-kind-table',newList);
    	    },
    	    error: function(resposta){
    	    	if(resposta.status === 422){
    	      		new ErrorFinder().publishErrors(resposta.responseJSON);
    	    	}
    	    }
    	  }
    );
  }

	setDescription(event){
		this.setState({description:event.target.value}); 
	}
}

class KindTable extends Component {
	render(){
		return(
			<div style={{ display: 'flex', justifyContent: 'center', marginLeft: '150px' }}>
   	            <table className="pure-table">
   	                <thead>
   	                  <tr>
   	                    <th>Description</th>
   	                  </tr>
   	                </thead>
   	                <tbody>
   	                    {this.props.lista.map(function(kind){
   	                    	return (
   	                        	<tr key={kind.id}>
   	                        	  <td>{kind.description}</td>
   	                        	</tr>
   	                      	);
   	                    }
   	                    )
   	                  }
   	                </tbody>
   	            </table>
			</div>
		);
	}
}

export default class KindBox extends Component{
		constructor() {
    	  super();
    	  this.state = {lista: []};
    	}

  	componentDidMount(){
    	$.ajax({
    	    url:"http://localhost:8080/kinds",
    	    dataType: 'json',
    	    success:function(resposta){
    	      console.log(this);
    	      this.setState({lista:this.state.lista.concat(resposta)});
    	    }.bind(this)
    	  }
    	);
  		PubSub.subscribe('refreshing-kind-table',function(topic,newList){
  			this.setState({lista:this.state.lista.concat(newList)});
  		}.bind(this));
  	}


	render(){
		return(
			<div className="content" id="content">
        <div id="main">
            <div className="header">
                <h1>Kinds Register</h1>
            </div>
            <div className="content" id="content">
              <KindForm callbackRefreshTable={this.refreshTable}/>
              <KindTable lista={this.state.lista}/>
            </div>
        </div>
			</div>

		);
	}
}