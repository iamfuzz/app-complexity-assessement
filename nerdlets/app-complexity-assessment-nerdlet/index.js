import React, { Component } from 'react';
import { Icon, Tooltip, NerdGraphQuery, TextField, AccountPicker, Stack, StackItem, Button, navigation, NrqlQuery } from 'nr1';
import gql from 'graphql-tag';
import { algorithm } from "./algorithm.js";
const API = "https://0um9golkl0.execute-api.us-east-1.amazonaws.com/prod"

// Local
import EmptyState from './EmptyState';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      accountId: null,
      key: null,
      splash: true,
      accountName: '',
    };

    this.onChangeAccount = this.onChangeAccount.bind(this);
  }

  onChangeAccount(value) {
      this.setState({ accountId: value });
    
      const accountId = value;      

      NerdGraphQuery.query({ variables: { accountId }, query: gql`query($accountId: Int!) {
            actor {
              account(id: $accountId) {
                name
              }
            }
          }`}).then(({ data }) => { this.setState( {accountName: data.actor.account.name} ) });
      }

  handleQuery() {
    if (this.state.accountId == null) {
      alert("Please select an account from the dropdown menu.");
      return;
    }
    if (this.state.key == null) {
      alert("Please enter a query key for the selected account.");
      return;
    }
    this.setState({ items: [] });
    this.setState({ splash: false });
    var snippet = [{"key": this.state.key, "account": this.state.accountName}]
    var ldata = snippet.concat(algorithm);
    fetch(API, {method: 'post', headers: {'Content-Type':'application/json'}, body: JSON.stringify(ldata)})
      .then(response => response.json())
      .then(data => this.setState({ items: data }));
  }

  handleClick(app) {
      NrqlQuery.query({accountId: this.state.accountId, query: "FROM Transaction SELECT latest(entityGuid) WHERE appName = '" + app + "'",formatType: NrqlQuery.FORMAT_TYPE.RAW}).then(({ data }) => {
          navigation.openStackedNerdlet({id:'topology.relationship-map', urlState: { 'entityId': data.raw.results[0].latest} });
          }).catch(error => {
                  console.log(error);
          });
  }

  render() {
    const { items } = this.state;
    return (
     <>
      <Stack
        className="toolbar-container"
        fullWidth
        gapType={Stack.GAP_TYPE.NONE}
        horizontalType={Stack.HORIZONTAL_TYPE.FILL_EVENLY}
        verticalType={Stack.VERTICAL_TYPE.FILL}
      >
        <StackItem className="toolbar-section1">
          <Stack
            gapType={Stack.GAP_TYPE.NONE}
            fullWidth
            verticalType={Stack.VERTICAL_TYPE.FILL}
          >
            <StackItem className="toolbar-item has-separator">
              <AccountPicker
                value={this.state.accountId}
                onChange={this.onChangeAccount}
              />
            </StackItem>
            <StackItem className="toolbar-item">
              <TextField onChange={() => this.setState( {key: event.target.value} )} label="Query Key" placeholder="NRAK-..." />
            </StackItem>
          </Stack>
        </StackItem>
        <StackItem className="toolbar-section2">
          <Stack
            fullWidth
            fullHeight
            verticalType={Stack.VERTICAL_TYPE.CENTER}
            horizontalType={Stack.HORIZONTAL_TYPE.RIGHT}
          >
            <StackItem>
              <Button onClick={() => this.handleQuery()} type={Button.TYPE.PRIMARY}>Query</Button>
            </StackItem>
          </Stack>
        </StackItem>
      </Stack>
      { this.state.splash && <EmptyState /> }
      <br/><br/>
      <center>
          <table>
                  <tr>
		    <th><center><h3>Application Name</h3></center></th>
		    <th>
                      <center>
                        <h3>Complexity Score</h3>
                      </center>
                    </th>
                    <th>
                      <Tooltip text="The complexity score for an application is calculated based on the algorithm contained in the file algoritm.js that is included in this application. By default, it is the number of Software Dependencies + Unique Transactions + the number of Programming Languages used.">
                        <Icon type={Icon.TYPE.INTERFACE__INFO__HELP} />
                      </Tooltip>
                    </th>
		  </tr>
		  {items.map(item =>
                    <tr>
                      <td><Button onClick={() => this.handleClick(item.name)} style={{margin: '15px', width: '250px'}} type={Button.TYPE.PLAIN} iconType={Button.ICON_TYPE.DATAVIZ__DATAVIZ__CHART} > {item.name} </Button></td>
		      <td colspan="2"><center>{item.value}</center></td>
                    </tr>
		  )}
          </table>
      </center>
     </>
    );
  }
}
export default App;
