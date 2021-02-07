import React from 'react';
import Table from 'react-bootstrap/Table'




class DisplayResults extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        entity: this.props.entity,
        sources: this.props.sources,
        score: 0
      };
    }

    render() {
        return (
            <div>
                {this.state.score > 0 ? 
                    <div className="text-center">
                        <h6>The following table displays the attributes we are able to discover about you through the dark net and surface web searches.</h6>
                        {/*<h6>The scores represent how potentially damaging each piece of information can be if it gets in the wrong hands.</h6>*/}
                        <Table striped bordered hover>
                        <thead>
                            <tr>
                            <th>Leaked Personal Attribute</th>
                            <th>Potential Threat</th>
                            <th>Sensitivity Level</th>
                            <th>Sources</th>
                            <th>Date Collected</th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.state.entity.phoneNumber ? <tr><td>phone number</td><td>spam</td><td>high</td><td>{this.state.sources.phoneNum}</td><td>{this.state.entity.dateCollected}</td></tr> : null}
                        {this.state.entity.email ? <tr><td>email</td><td>spam, phishing</td><td> low</td><td>{this.state.sources.email}</td><td>{this.state.entity.dateCollected}</td></tr> : null}
                        {this.state.entity.password ? <tr><td>password</td><td>access to private accounts</td><td>{this.state.sources.password}</td><td>{this.state.entity.dateCollected}</td><td> high</td></tr> : null}
                        {this.state.entity.address ? <tr><td>address</td><td>spam</td><td> high</td><td>{this.state.sources.address}</td><td>{this.state.entity.dateCollected}</td></tr> : null}
                        {this.state.entity.birthday ? <tr><td>birthday</td><td>identity theft</td><td>low</td><td>{this.state.sources.birthday}</td><td>{this.state.entity.dateCollected}</td></tr> : null}
                        {this.state.entity.hometown ? <tr><td>hometown</td><td>identity theft</td><td>low</td><td>{this.state.sources.hometown}</td><td>{this.state.entity.dateCollected}</td></tr> : null}
                        {this.state.entity.currenttown ? <tr><td>current town</td><td>identity theft</td><td>low</td><td>{this.state.sources.currentTown}</td><td>{this.state.entity.dateCollected}</td></tr> : null}
                        {this.state.entity.jobdetails ? <tr><td>job details</td><td>identity theft</td><td>low</td><td>{this.state.sources.jobDetails}</td><td>{this.state.entity.dateCollected}</td></tr> : null}
                        {this.state.entity.relationshipstatus ? <tr><td>relationship status</td><td>spam</td><td>high</td><td>{this.state.sources.relationshipStatus}</td><td>{this.state.entity.dateCollected}</td></tr> : null}
                        {this.state.entity.interests ? <tr><td>interests</td><td></td>phishing<td>low</td><td>{this.state.sources.interests}</td><td>{this.state.entity.dateCollected}</td></tr> : null}
                        {this.state.entity.political ? <tr><td>political views</td><td>discrimination</td><td> high</td><td>{this.state.sources.politicalViews}</td><td>{this.state.entity.dateCollected}</td></tr> : null}
                        {this.state.entity.religious ? <tr><td>religious views</td><td>discrimination</td><td> high</td><td>{this.state.sources.religiousViews}</td><td>{this.state.entity.dateCollected}</td></tr> : null}
                        </tbody>
                        </Table>
                    </div> 
                    : 
                    null
                }
            </div>
        )
      }
    
}

export default DisplayResults;