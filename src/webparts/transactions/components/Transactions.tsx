import * as React from 'react';
import styles from './Transactions.module.scss';
import { ITransactionsProps } from './ITransactionsProps';
import { ITransactionsState } from './ITransactionsState';
//import { escape } from '@microsoft/sp-lodash-subset';

export default class Transactions extends React.Component<ITransactionsProps, ITransactionsState> {

  public constructor(props: ITransactionsProps,state: ITransactionsState){
    super(props);
    this.state = {
      toggle: 0,
    }
  }

  public onToggleChange(tog: number):any{
    this.setState({toggle: tog})
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
        <div className={styles.TabsContainer}>
          <div className={(this.state.toggle===1)?(styles['tab-active']):(styles.tab)} onClick={this.onToggleChange(1)}>
            Home
          </div>
          <div className={(this.state.toggle===2)?(styles['tab-active']):(styles.tab)} onClick={this.onToggleChange(2)}>
            Entry
          </div>
          <div className={(this.state.toggle===3)?(styles['tab-active']):(styles.tab)} onClick={this.onToggleChange(3)}>
            Statement
          </div>
          <div className={(this.state.toggle===4)?(styles['tab-active']):(styles.tab)} onClick={this.onToggleChange(4)}>
            Update
          </div>
        </div>
      </div>
    );
  }
}
