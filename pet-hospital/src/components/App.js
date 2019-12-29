import React, { Component } from 'react'
import '../css/App.css';
import AddAppointment from './AddAppointment';
import ListAppointment from './ListAppointment';
import SearchAppointment from './SearchAppointment'
import {without} from 'lodash'
import {findIndex} from 'lodash'
// without is used to take an array and find & delete a record from the array & retun back the new array minus the record

class App extends Component
{  
  
  state = 
  {
      appointments: [],
      formDisplay : false,
      idx: 0,
      orderBy: 'petName',
      orderDir: 'asc',
      queryText: ''
  };

  updateInfo = (name, val, id) =>
  {
    let tempApts = this.state.appointments;
    let idx = findIndex(this.state.appointments, {aptID : id});
    tempApts[idx][name] = val;
    this.setState({
      appointments : tempApts
    })

  }

  changeOrder = (order,dir)  =>
  {
    this.setState({
      orderBy:order,
      orderDir:dir
    });

  }


  toggleForm = () =>
  {
    this.setState({
      formDisplay : !this.state.formDisplay
    })
  }

  AddAppointment = (apt) =>
  {
    let tempApt = this.state.appointments;
    apt.aptID = this.state.idx;
    tempApt.unshift(apt);
    this.setState({
      appointments : tempApt,
      idx : this.state.idx + 1
    })
  }
  
  deleteAppointment = (apt) =>
  {    
    let temp = this.state.appointments;
    console.log(temp);
    temp = without(temp,apt)
    console.log(temp);
    this.setState({
      appointments : temp
    });    
  }

  SearchAppointments = (query) =>
  {
    this.setState({
      queryText : query
    })
  }


  componentDidMount()
  {
    fetch('./data.json')
      .then(response => response.json())
      .then(result =>
        {
          const apts = result.map(item =>
            {
              item.aptID = this.state.idx;
              this.setState({idx: this.state.idx +1 })
              return item;
            })
            this.setState({
              appointments : apts
            })
        })

    
  }

  render()
  {

      let order;
      let results = this.state.appointments;
      
      (this.state.orderDir === 'asc' ? order = 1 : order = -1);

      results = results.sort((a,b) =>
      {
        if(a[this.state.orderBy].toLowerCase() < b[this.state.orderBy].toLowerCase())
        { return (  -1 * order ) }
        else
          { return ( 1 * order) }
      }).filter(eachItem =>{
        return (
          eachItem['petName'].toLowerCase().includes(this.state.queryText.toLowerCase()) ||
          eachItem['ownerName'].toLowerCase().includes(this.state.queryText.toLowerCase()) ||
          eachItem['aptNotes'].toLowerCase().includes(this.state.queryText.toLowerCase())
        )
      });

      

    return (
      <div>        
      <main className="page bg-white" id="petratings">        
        <div className="container">          
          <div className="row">
            <div className="col-md-12 bg-white">
              <div className="container">                     
                <AddAppointment 
                  formDisplay={this.state.formDisplay}
                  toggleForm={this.toggleForm}
                  AddAppointment={this.AddAppointment}
                 />               
                <SearchAppointment
                  orderBy={this.state.orderBy} 
                  orderDir={this.state.orderDir}
                  changeOrder={this.changeOrder}
                  SearchAppointments={this.SearchAppointments}
                 />
                <ListAppointment 
                appointments={results}
                deleteAppointment={this.deleteAppointment}
                updateInfo={this.updateInfo}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      </div>
    );
  }
}

export default App;
