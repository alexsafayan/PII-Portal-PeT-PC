import React from 'react';
import DisplayResults from './DisplayResults.js'
import EmailDataService from "../services/email.service";
import Alert from 'react-bootstrap/Alert'
import GaugeChart from 'react-gauge-chart'
import PuffLoader from "react-spinners/PuffLoader";
import BeatLoader from "react-spinners/BeatLoader";
import { SiCheckmarx } from "react-icons/si";
import '../App.css'
import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/Button'




class Homepage extends React.Component {

    

    constructor(props) {
        super(props);
        this.state = {
          numBreaches: "4,240",
          numEmails: "12,423,941,567",
          numNames: "22,342,131",
          showBreachTotals: true,
          results: "",
          searchValue: "",
          nameValue: "",
          zipValue: "",
          errorMessage: "",
          surfaceSearchComplete: false,
          dbComplete: false,
          line1: "",
          line2: "",
          line3: "",
          showEntities: false,
          showHighScore: false,
          showMediumScore: false,
          showLowScore: false,
          showSearchByName: true,
          showSearch: true,
          showSearchAgain: false,
          showLoader: false,
          entityInd: -1,
          selectedValue: "",
          entities: [],
          sources: [],
          datesCollected: [],
          score: 0,
          fieldName: 'Email'
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.validateEmail = this.validateEmail.bind(this);
        this.selectField = this.selectField.bind(this);
        this.DisplayResults = React.createRef();
      }
    
    handleSubmit(event) {
        this.setState({
            errorMessage: "",
            line1: "",
            showEntities: false,
            showHighScore: false,
            showMediumScore: false,
            showLowScore: false,
            score: 0
        });
        console.log("in handle submit");
        if(this.validateEmail(this.state.searchValue)) {

            console.log("email is valid")
            this.setState({
                showSearch: false,
                showLoader: true,
                loaderMessage: "Searching breached records",
                showSearchByName: false,
            })
            EmailDataService.getByEmail(this.state.searchValue)
            .then(response => {
                if(response.status === 202) {
                    console.log("response:")
                    console.log(response)
                    this.setState({
                        dbComplete: true,
                        loaderMessage: "Searching surface web"
                    })
                    EmailDataService.searchSurfaceWebEmail(this.state.searchValue, response.data.dbResponse)
                    .then(response2 => {
                        console.log("response2: ")
                        console.log(response2)
                        //alert("we have your name and zip in database")
                        if(response2.status === 202) {
                            var entities = []
                            var sources = []
                            var dates = []
                            for(var i = 0; i < response2.data.entities.length; i++) {
                                entities.push(response2.data.entities[i])
                                sources.push(response2.data.sources[i])
                                dates.push(response2.data.dates[i])
                            }
                            this.setState({
                                surfaceSearchComplete: false,
                                dbComplete: false,
                                showSurfaceWebResponse: false,
                                showLoader: false,
                                entities: entities,
                                sources: sources,
                                datesCollected: dates,
                            })
                            this.callDisplay(entities[0],sources[0],dates[0])
                            return true;
                        } else if(response2.status === 204) {
                            this.setState({
                                showLoader: false,
                                surfaceSearchComplete: false,
                                dbComplete: false,
                                line1: "Your email has been compromised.",
                                line2: "",
                                line3: "",
                                showSearchAgain: true,
                                searchAgainClass: "col-5"
                            })
                            return false
                        }
                    }).catch(e => {
                        console.log("error on second api call")
                        console.log(e);
                        //alert("we do not have your name and zip stored in the database")
                        
                    });
                    return true;
                } else if(response.status === 204) {
                    this.setState({
                        showLoader: false,
                        surfaceSearchComplete: false,
                        dbComplete: false,
                        line1: "We do not have any record of your email being compromised.",
                        line2: "",
                        line3: "",
                        showSearchAgain: true
                    })
                    return false
                }else if(response.status === 201) {
                    console.log("response: ")
                    console.log(response)
                    this.setState({
                        showLoader: false,
                        line1: "We do not have any record of your information being compromised.",
                        line2: "",
                        line3: "",
                        showSearchAgain: true
                    })
                }
            }).catch(e => {
                console.log(e);
                this.setState({
                    showLoader: false,
                    line1: "We do not have any record of your email being compromised.",
                    line2: "",
                    line3: "",
                    showSearchAgain: true
                })
                return false
            });
        }
        else{
            console.log("email is invalid")
            this.setState({
                errorMessage: "Please enter a valid email address."
            })
        }
        event.preventDefault();
    }

    setSelection(event) {
        console.log(event.target.value);
        this.setState({
            selectedValue: event.target.value
        });
      }

    handleChange(field, event) {
        if(event.target.value.indexOf(field + ": ") == 0) {
            var newVal = event.target.value.substring(field.length + 2)
            if(field === 'Email') {
                this.setState({searchValue: newVal});
            }else if(field === 'Name'){ 
                this.setState({nameValue: newVal});
            }
            else if(field === 'Zip') {
                this.setState({zipValue: newVal});
            }
            
            event.preventDefault();
        } else if(event.target.value == ""){
            if(field === 'Email') {
                this.setState({searchValue: ""});
            }else if(field === 'Name'){ 
                this.setState({nameValue: ""});
            }
            else if(field === 'Zip') {
                this.setState({zipValue: ""});
            }
        }
    }

    chooseEntity(id, event) {
        event.preventDefault();
        console.log("selected value: "+id)
        this.setState({
            selectedValue: id,
            entityInd: id,
            showEntities: false,
            showSearchAgain: true,
            searchAgainClass: "col-4"
        })
        this.callDisplay(this.state.entities[id],this.state.sources[id],this.state.datesCollected[id])
        
    }

    callDisplay(entity, sources, datesCollected) {
        this.DisplayResults.current.setState({entity: null, sources:null,datesCollected:null})
        //display returned results
        console.log("in calldisplay")
        console.log(entity)
        console.log(sources)
        this.DisplayResults.current.setState({
            entity: entity,
            sources: sources,
            datesCollected: datesCollected,
            score: entity.score
        })
        if(entity.score<1.6){
            this.setState({
                showLowScore: true,
                entity: entity,
                source: sources,
                dates: datesCollected,
                entityInd: 0
            })
        }
        else if(entity.score>8.4){
            this.setState({
                showHighScore: true,
                entity: entity,
                source: sources,
                dates: datesCollected,
                entityInd: 0
            })
        }
        else {
            this.setState({
                showMediumScore: true,
                entity: entity,
                source: sources,
                dates: datesCollected,
                entityInd: 0
            })
        }
    }

    validateEmail(email) {
        console.log("in validate email")
        //const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var re = /\S+@\S+\.\S+/;
        return re.test(String(email).toLowerCase());
    }

    selectField(field, event) {
        event.preventDefault();
        this.setState({
            fieldName:field
        })
    }



    render() {
        return [
                <div>
                {this.state.showSearch ? 
                <div className='form-group row justify-content-center' style={{height:'75px'}}>
                    <div className="col-lg-1" style={{paddingLeft: 0,paddingRight: 0}}>
                    <Dropdown style={{backgroundColor: '#203864', color:'#B9BDC5', borderColor:'#656565', height:'100%'}}>
                    <Dropdown.Toggle style={{width: '100%', backgroundColor: '#203864', color:'#B9BDC5', borderColor:'#656565', height:'100%', fontSize: 'x-large'}} id="dropdown-basic">
                        Field
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={(e) => this.selectField('Email', e)}>Email</Dropdown.Item>
                        <Dropdown.Item onClick={(e) => this.selectField('Name & Zip', e)}>Name &amp; Zip</Dropdown.Item>
                    </Dropdown.Menu>
                    </Dropdown>
                    </div>
                    {this.state.fieldName == 'Email' && 
                        <div className="col-lg-4" style={{paddingLeft: 0,paddingRight: 0}}>
                            <input style={{height:'100%',  fontSize: 'large', width:'100%'}} id="search" className="form-control" type="search" placeholder="Search different fields by changing field name." aria-label="Search" value={this.state.fieldName + ": " + this.state.searchValue} onChange={(e) => this.handleChange('Email', e)} />
                        </div> 
                    }
                    {this.state.fieldName == 'Name & Zip' && 
                        <>
                        <div className="col-lg-2" style={{paddingLeft: 0,paddingRight: 0}}>
                            <input style={{height:'100%',  fontSize: 'large', width:'100%'}} id="search" className="form-control" type="search" placeholder="Search different fields by changing field name." aria-label="Search" value={"Name: " + this.state.nameValue} onChange={(e) => this.handleChange('Name', e)} />
                        </div> 
                        <div className="col-lg-2" style={{paddingLeft: 0,paddingRight: 0}}>
                            <input style={{height:'100%',  fontSize: 'large', width:'100%'}} id="search" className="form-control" type="search" placeholder="Search different fields by changing field name." aria-label="Search" value={"Zip: " + this.state.zipValue} onChange={(e) => this.handleChange('Zip', e)} />
                        </div> 
                        </>
                    }
                    
                    <div className="col-lg-1" style={{paddingLeft: 0,paddingRight: 0}}>
                    <button style={{width: '100%', height:'100%',  backgroundColor: '#203864', color:'#B9BDC5', borderColor:'#656565', fontSize: 'x-large'}} className="btn" onClick={this.handleSubmit}>Search</button>
                    </div>
                </div> : null}
                </div>
                ,

                <div className="container d-flex justify-content-center">
                    {this.state.errorMessage.length === 0 ? 
                    <div style={{marginTop:'82px'}}></div>
                    : 
                    <Alert variant="danger">
                        <p>{this.state.errorMessage}</p>
                    </Alert>
                    }
                </div>,   

                <div style={{fontSize: 'xx-large', fontWeight: 'bold'}}>
                    {this.state.showBreachTotals && 
                    <>
                    <div className='row justify-content-center'>
                        <div className="col-lg-2 ">
                            <div className="row justify-content-center"> 
                                {this.state.numBreaches}
                            </div>
                            <div className="row justify-content-center"> 
                                breaches
                            </div>
                        </div> 
                        <div className="col-lg-2">
                            <div className="row justify-content-center"> 
                                {this.state.numEmails}
                            </div>
                            <div className="row justify-content-center"> 
                                emails
                            </div>
                        </div> 
                        <div className="col-lg-2">
                            <div className="row justify-content-center"> 
                                {this.state.numNames}
                            </div>
                            <div className="row justify-content-center"> 
                                names
                            </div>
                        </div> 
                    </div>
                    <div className='row justify-content-center'>
                        How do I protect myself? Find out&nbsp;<a style={{color: "inherit"}}href="/ProtectYourself"><u>here</u></a>.
                    </div>
                    </>
                    }
                </div>,


                <div style={{cursor:'pointer'}} className="container">
                    {this.state.showHighScore ? 
                    <div className="row justify-content-center text-center">
                        <Alert variant="danger">
                            <h4>{this.state.entities[this.state.entityInd].name}</h4>
                            <p>You belong to {this.state.entities[this.state.entityInd].agebucket}. Based on the personally identifiable information we found, we determined that you have a <b>high</b> privacy exposure rating relative to your age group.</p>
                        </Alert>
                    </div>
                    : null}
                </div>,

                <div style={{cursor:'pointer'}} className="container">
                   {this.state.showMediumScore ? 
                   <div className="row justify-content-center text-center">
                        <Alert variant="warning">
                            <h4>{this.state.entities[this.state.entityInd].name}</h4>
                            <p>You belong to {this.state.entities[this.state.entityInd].agebucket}. Based on the personally identifiable information we found, we determined that you have a <b>medium</b> privacy exposure rating relative to your age group.</p>
                        </Alert>
                    </div>
                    : null}
                </div>,

                <div style={{cursor:'pointer'}} className="container">
                   {this.state.showLowScore ? 
                   <div className="row justify-content-center text-center">
                        <Alert variant="success">
                            <h4>{this.state.entities[this.state.entityInd].name}</h4>
                            <p>You belong to {this.state.entities[this.state.entityInd].agebucket}. Based on the personally identifiable information we found, we determined that you have a <b>low</b> privacy exposure rating relative to your age group.</p>
                        </Alert>
                    </div>
                    : null}
                </div>,

                 <div className="container d-flex justify-content-center">
                    <h3>{this.state.line1}</h3>
                </div>,

                <div className="container d-flex justify-content-center">
                    <p>{this.state.line2}</p>
                    <p><b>{this.state.line3}</b></p>
                </div>,

                <div className="container">
                {this.state.showEntities ? 
                    <div>
                    <h1 className="text-center">We found {this.state.entities.length} potential match{this.state.es}:</h1>
                    <div className="row">
                    {this.state.entities.map((value, index) => {
                        return <div className="col-4" style={{paddingBottom: "10px"}}>
                            <div className="card" style={{paddingBottom: "10px"}}>
                                <div className="card-body" style={{paddingBottom: "10px"}}>
                                <h5 className="card-title">{value.name}</h5>
                                <p className="card-text">Phone number: {value.phoneNumber}</p>
                                <p className="card-text">Birthyear: {value.birthyear}</p>
                                <a onClick={(e) => this.chooseEntity(index, e)} className="btn btn-secondary">Select</a>
                                </div>
                            </div>
                        </div>
                    })}
                    </div>
                    </div>
                    : null
                }
                </div>,

                <div className="container">
                {this.state.dbComplete && 
                    <div>
                    <h2 className="text-center">Searching breached records <SiCheckmarx/></h2>
                    </div>
                }
                </div>,

                <div className="container">
                {this.state.surfaceSearchComplete && 
                    <div>
                    <h2 className="text-center">Searching surface web <SiCheckmarx/></h2>
                    </div>
                }
                </div>,

                <div className="container d-flex justify-content-center">
                    {this.state.showLoader ? 
                    <div> 
                        <h2>{this.state.loaderMessage}<BeatLoader color={"#000000"} loading={true} size={20} /> </h2>
                        
                    </div>
                    
                    : null}

                </div>,

                <div className="container d-flex justify-content-center">
                    <DisplayResults ref={this.DisplayResults}/>
                </div>,

                <div>
                    {this.state.entityInd >=0 ? 
                        <div className="row">
                            <div className="col">
                            </div>
                        <div className="col">
                            <GaugeChart 
                                id="gauge-chart2" 
                                nrOfLevels={3} 
                                percent={this.state.entities[this.state.entityInd].percentile}
                                textColor={"#000000"} 
                                arcsLength={[0.159, 0.682, 0.159]}
                                style={{width:'100%'}}
                                arcPadding={0}
                                cornerRadius={2}
                            />
                        </div>
                        <div className="col">
                        </div>
                        </div>
                    : null}
                </div>,

                <div className="container d-flex justify-content-center">
                    {this.state.showSearchAgain ? <a href="/Home"><button className="btn btn-outline-dark">Search Again</button></a> 
                    : null
                    }
                </div>
                    

        ]
    }
}

export default Homepage;