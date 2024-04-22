import * as React from 'react';
import styles from './Transactions.module.scss';
import { ITransactionsProps } from './ITransactionsProps';
import { ITransactionsState } from './ITransactionsState';
import {SPHttpClient, SPHttpClientResponse} from "@microsoft/sp-http";
//import { escape } from '@microsoft/sp-lodash-subset';
import './Transactions.css';
import { Dropdown } from '@fluentui/react';
import { IDropdownOption } from 'office-ui-fabric-react';
//import { DatePicker } from '@fluentui/react';

//import from "react-";
export default class Transactions extends React.Component<ITransactionsProps, ITransactionsState> {

  public constructor(props: ITransactionsProps,state: ITransactionsState){
    super(props);
    this.state = {
      toggle: 1,
      typeList: "CredDebitInv",
      typeArr: [],
      selectedType: "",
      catList: "Categories",
      catArr: [],
      selectedCat: "",
      selDate:"",
      purpose:"",
      amount:0,
      statementList:"Statement",
      paidList: "PaidThrough",
      paidArr: [],
      selPaid: "NA"
    }
  }
  public componentDidMount(): void {
    this.getTypeFunction();
    this.getCategory();
  }
  public handleClick(index: number):any{
    this.setState({toggle : index})
  }
  public handleDateChange=(e:any)=>{
    this.setState({selDate: e.target.value});
  }
  public handleAmountChange=(e:any)=>{
    this.setState({amount:e.target.value});
  }
  public getTypeFunction(){
    let select = "?$select=*";
    this.getListItems(this.props.newspHttpClient,this.props.newsiteUrl,this.state.typeList,select).then((listItemData: any)=>{
      let listItem = listItemData.d.results;
      if(listItem.length >0){
        let tempTypeList: any=[];
        listItem.map((tempTypeCurrent: any)=>{
          tempTypeList.push({key: tempTypeCurrent.Id,text: tempTypeCurrent.Title});
        });
        this.setState({typeArr: tempTypeList});
      }
      else{
        this.setState({typeArr:[]})
      }
    });
  }
  public getListItems(requester: SPHttpClient, siteUrl: string, listName: string, select: string):any{
    try{
      return requester.get(`${siteUrl}/_api/web/lists/getbytitle('${listName}')/items${select}`,
          SPHttpClient.configurations.v1,
          {
              headers:{
                "Accept": "application/json;odata=verbose",
                "odata-version": ""
              }
          })
          .then((response: SPHttpClientResponse)=>{
              return response.json();
          })
          .then((json: any)=>{
            return json;
          })
    } catch(error){
      console.log(`Error occured in getListItems method Erroro Message: ${error.message}`);
      throw error;
    }
  }
  public getListItemsWithFilter(requester: SPHttpClient, siteUrl: string, listName: string, select: string,filter: string):any{
    try{
      return requester.get(`${siteUrl}/_api/web/lists/getbytitle('${listName}')/items${select}${filter}`,
          SPHttpClient.configurations.v1,
          {
              headers:{
                "Accept": "application/json;odata=verbose",
                "odata-version": ""
              }
          })
          .then((response: SPHttpClientResponse)=>{
              return response.json();
          })
          .then((json: any)=>{
            return json;
          })
    } catch(error){
      console.log(`Error occured in getListItems method Erroro Message: ${error.message}`);
      throw error;
    }
  }
  public typeChangeFunction=(event: React.FormEvent<HTMLDivElement>,item:IDropdownOption):void=>{
    this.setState({selectedType: item.text as string},()=>{
      if(this.state.selectedType != '' && this.state.selectedType!=''){
        this.getCategory();
      }
    })
  }
  public getCategory(){
    let select = "?$select=*";
    let filter = "&$filter=Field eq '"+this.state.selectedType+"' &$orderby=Title asc";
    //console.log(filter);
    this.getListItemsWithFilter(this.props.newspHttpClient,this.props.newsiteUrl,this.state.catList,select,filter).then((listItemData: any)=>{
      //console.log(listItemData.d.results);
      let listItem = listItemData.d.results;
      if(listItem.length > 0){
        let tempCatList: any=[];
        listItem.map((tempCatCurrent: any)=>{
          tempCatList.push({key: tempCatCurrent.Id, text:tempCatCurrent.Title});
        });
        this.setState({catArr: tempCatList});
      }
      else{
        this.setState({catArr:[]});
      }
    });
    /*this.getListItems(this.props.newspHttpClient,this.props.newsiteUrl,this.state.catList,select).then((listItemData: any)=>{
      console.log(listItemData.d.results);
      let listItem = listItemData.d.results;
      if(listItem.length > 0){
        let tempCatList: any=[];
        listItem.map((tempCatCurrent: any)=>{
          tempCatList.push({key: tempCatCurrent.Id, text:tempCatCurrent.Title});
        });
        this.setState({catArr: tempCatList});
      }
      else{
        this.setState({catArr:[]});
      }
    });*/
  }
  public catChangeFunction=(event: React.FormEvent<HTMLDivElement>,item:IDropdownOption):void=>{
    this.setState({selectedCat: item.text as string},()=>{
      if(this.state.selectedCat != "" && this.state.selectedCat!=''){
      this.getPaidThrough();}
    });
  }
  public getPaidThrough(){
    let select = "?$select=*";
    this.getListItems(this.props.newspHttpClient,this.props.newsiteUrl,this.state.paidList,select).then((listItemData: any)=>{
      let listItem = listItemData.d.results;
      if(listItem.length >0){
        let tempPaidList : any =[];
        listItem.map((tempPaidCurrent:any)=>{
          tempPaidList.push({key: tempPaidCurrent.Id,text: tempPaidCurrent.Title});
        });
        this.setState({paidArr:tempPaidList});
      }
      else{
        this.setState({paidArr: []})
      }
    });
  }
  public paidChangeFunction=(event: React.FormEvent<HTMLDivElement>,item:IDropdownOption):void=>{
    this.setState({selPaid: item.text as string},()=>{
      if(this.state.selPaid != "" && this.state.selPaid!=''){}
    });
  }
  public createEntry(){
    if((this.state.selDate==="") || (this.state.selectedCat==="")||(this.state.selectedType==="")||(this.state.purpose==="")){
      alert("Fill all the Fields");
    }
    else{
      if(this.state.amount <= 0){alert("Amount cannot be less than 1 rupee")}
      else{

        let commentBody = "SP.Data."+this.state.statementList+"ListItem";
        commentBody = "{__metadata:{'type':'"+commentBody+"'},";
        commentBody += "Date:'"+this.state.selDate+"',";
        commentBody += "CreDebInv:'"+this.state.selectedType+"',";
        commentBody += "Category:'"+this.state.selectedCat+"',";
        commentBody += "Title:'"+this.state.purpose+"',";
        commentBody += "Amount:'"+this.state.amount+"',";
        commentBody += "PaidThrough:'"+this.state.selPaid+"'";
        commentBody += "}";
        console.log(commentBody);
        this.createItem(this.props.newspHttpClient,this.props.newsiteUrl,commentBody,this.state.statementList);
        alert("Entry added successfully!");
        this.setState({selPaid: "NA"});
      }
    }
  }
  public createItem(requester: SPHttpClient, siteUrl: string, data: any, listName: string): any{
    try {
      return requester.post(`${siteUrl}/_api/web/lists/getbytitle('${listName}')/items`,
          SPHttpClient.configurations.v1,
          {
              headers: {
                  "Accept": "application/json;odata=verbose",
                  'Content-type': 'application/json;odata=verbose',
                  "odata-version": ""
              },
              body: data
          })
          .then((response: SPHttpClientResponse) => {
              return response.json();
          })
          .then((json: any) => {
              return (json);
          });
  } 
  catch (error) {
      console.log(`Error occured in addItems method in Factory.ts. Error message: ${error.message}`);
      throw error;
  }
  }
  public render(): React.ReactElement<ITransactionsProps> {
    const {
    } = this.props;
    return (
      <div className={styles.Whole}>
        <div className={styles.Horizline}>
          <div className={styles['page-header']}>
                  <div className={styles['profile-header']}>
                      Statement
                  </div>
                  <div className={styles.Line}></div>
                  <div className={styles.Caption}>
                    Expense Tracker.<br/> 
                    Developed By YashSol.
                  </div>
          </div> 
        </div>
        <div className="TabsContainer">
          <div className={(this.state.toggle === 1)?"tabActive":"tab"} onClick={()=>this.handleClick(1)}>Dashboard</div>
          <div className={(this.state.toggle === 2)?"tabActive":"tab"} onClick={()=>this.handleClick(2)}>Entry</div>
          <div className={(this.state.toggle === 3)?"tabActive":"tab"} onClick={()=>this.handleClick(3)}>Statement</div>
          <div className={(this.state.toggle === 4)?"tabActive":"tab"} onClick={()=>this.handleClick(4)}>Update</div>
        </div>
        <div className="ContentContainer">
          <div className={(this.state.toggle === 1)?"contentActive":"content"} onClick={()=>this.handleClick(1)}>Contents of Dashboard</div>
          <div className={(this.state.toggle === 2)?"contentActive":"content"} onClick={()=>this.handleClick(2)}>
            <div className="entryBlock">
              <div className="blockHeadingDecor"><div className="blockHeading">Entry</div></div>
              <div className="entryContents">
                <div className="tableDiv">
                  <table className="tableClass">
                    <tr>
                      <td className="tdAlignRight">Date</td><td className="td">:</td>
                      <td className="td">
                        <input type="date" className="inputDate" onChange={this.handleDateChange.bind(this)}/>
                      </td>
                    </tr>
                    <tr>
                    <td className="tdAlignRight">Type</td><td className="td">:</td>
                    <td className="td">
                      <Dropdown
                        placeholder={(this.state.selectedType!="")?this.state.selectedType:"Select Type"}
                        options={this.state.typeArr}
                        selectedKey={this.state.selectedType}
                        onChange = {this.typeChangeFunction}
                      />
                    </td>
                    </tr>
                    <tr>
                    <td className="tdAlignRight">Category</td><td className="td">:</td>
                    <td className="td">
                      <Dropdown 
                        placeholder={(this.state.selectedCat != "")?this.state.selectedCat:"Select Category"}
                        options={this.state.catArr}
                        selectedKey={this.state.selectedCat}
                        onChange={this.catChangeFunction}
                        disabled ={(this.state.selectedType!="")?false:true}
                      />
                    </td>
                    </tr>
                    <tr>
                    <td className="tdAlignRight">Purpose</td><td className="td">:</td>
                    <td className="td">
                      <input type="text" className="inputClass" onChange={(e)=>{this.setState({purpose:e.target.value})}}/>
                    </td>
                    </tr>
                    <tr>
                    <td className="tdAlignRight">Amount</td><td className="td">:</td>
                    <td className="td">
                      ₹&ensp;<input type="text" className="inputClass" onChange={this.handleAmountChange.bind(this)}/>
                    </td>
                    </tr>
                    <tr>
                      <td className="tdAlignRight">Paid through</td><td className="td">:</td>
                      <td className="td">
                        <Dropdown
                          placeholder={((this.state.selPaid!=="")&&(this.state.selPaid !=="NA"))?this.state.selPaid:"Select Payment option"}
                          selectedKey={this.state.selPaid}
                          options={this.state.paidArr}
                          onChange={this.paidChangeFunction}
                          disabled ={((this.state.selectedType==="Credit")||(this.state.selectedType===""))?true:false}
                        />
                      </td>
                    </tr>
                  </table>
                  <div className="btnDiv">
                    <button className="btnClass" onClick={this.createEntry.bind(this)}>Submit</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={(this.state.toggle === 3)?"contentActive":"content"} onClick={()=>this.handleClick(3)}>Contents of Statement</div>
          <div className={(this.state.toggle === 4)?"contentActive":"content"} onClick={()=>this.handleClick(4)}>Contents of Update</div>
        </div>
      </div>
    );
  }
}
