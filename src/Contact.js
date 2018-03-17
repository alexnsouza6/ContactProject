import React, { Component } from 'react';
import InputForm from './components/InputForm.js';
import FormButton from './components/FormButton.js';
import './css/Form_org.css';
import PubSub from 'pubsub-js';
import $ from 'jquery';
import ErrorFinder from './ErrorFinder.js'

class ContactForm extends Component {
	componentDidMount(){
    PubSub.subscribe('get-all-kinds',function(topic,newKinds){
      this.setState({kind:this.state.kind.concat(newKinds)});
    }.bind(this));
  }

  constructor() {
      super();
      this.state = {name:'', email:'', birthdate:'', kind:[]};
      this.enviaForm = this.enviaForm.bind(this);
      this.setName = this.setName.bind(this);
      this.setEmail = this.setEmail.bind(this);
      this.setBirthdate = this.setBirthdate.bind(this);
    }

  render(){
    return(
      <div className="pure-form pure-form-aligned">
          <form className="pure-form pure-form-aligned organize" onSubmit={this.enviaForm} method='post'>
            <InputForm id="name" name="name" value={this.state.name} type="text" onChange={this.setName} label="Name" />
            <InputForm id="email" name="email" value={this.state.email} type="email" onChange={this.setEmail} label="Email" />
            <InputForm id="date" name="birthdate" value={this.state.birthdate} type="date" onChange={this.setBirthdate} label="Birthdate" />
            <label className="select"> Kind 
            <select className="select">
              {this.state.kind.map(function(kind){
                return (
                      <option key={kind.id} value={kind.description}>{kind.description}</option>
                  );
                  }
                  )
              }
            </select>
            </label>
            <FormButton type="submit"/>
          </form>
      </div>
		);
	 }

	enviaForm(evento){
    evento.preventDefault();
    $.ajax({
        url:"http://localhost:8080/contacts",
        contentType: 'application/json',
        dataType: 'json',
        type:'POST',
        data: JSON.stringify({name:this.state.name,
                              email:this.state.email,
                              birthdate:this.state.birthdate,
                              kind:this.state.kind.id
                            }),
        success:function(newList){
          PubSub.publish('refreshing-contact-table',newList);
        },
        error: function(resposta){
        	if(resposta.status === 422){
          		new ErrorFinder().publishErrors(resposta.responseJSON);
        	}
        }
      }
    );
  }

  	setName(evento){
  	  this.setState({name:evento.target.value});
  	}

  	setEmail(evento){
  	  this.setState({email:evento.target.value});
  	}

  	setBirthdate(evento){
  	  this.setState({birthdate:evento.target.value});
  	}

  	setKind(event){
  	  this.setState({kind:event.target.value});
  	}

}

class ContactTable extends Component {
  render(){
		return(
			<div style={{ display: 'flex', justifyContent: 'center', marginLeft: '150px' }}>
                <table className="pure-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Birthdate</th>
                        <th>Kind</th>
                      </tr>
                    </thead>
                    <tbody>
                        {this.props.lista.map(function(contact){
                          console.log(contact)
                        	return (
                            	<tr key={contact.id}>
                            	  <td>{contact.name}</td>
                            	  <td>{contact.email}</td>
                                <td>{contact.birthdate}</td>
                            	  <td>{contact.kind.description}</td>
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


export default class ContactBox extends Component{
	constructor() {
      super();
      this.state = {lista: [], kind : []};
    }

  componentDidMount(){
    /* CONTACT TABLE REQUEST */
  	$.ajax({
  	    url:"http://localhost:8080/contacts",
  	    dataType: 'json',
  	    success:function(resposta){
  	      this.setState({lista:this.state.lista.concat(resposta)});
  	    }.bind(this)
  	  }
  	);
  	PubSub.subscribe('refreshing-contact-table',function(topic,newList){
  		this.setState({lista:this.state.lista.concat(newList)});
  	}.bind(this));
  
    /* KIND SELECT REQUEST */
    $.ajax({
      url:"http://localhost:8080/kinds",
      dataType: 'json',
      success:function(newKinds){
        PubSub.publish('get-all-kinds',newKinds);
      },
      }
    );
  }

	render(){
		return(
			<div className="content" id="content">
        <div id="main">
            <div className="header">
                <h1>Contacts Register</h1>
            </div>
            <div className="content" id="content">
              <ContactForm callbackRefreshTable={this.refreshTable}/>
              <ContactTable lista={this.state.lista}/>
            </div>
        </div>
			</div>

		);
	}
}