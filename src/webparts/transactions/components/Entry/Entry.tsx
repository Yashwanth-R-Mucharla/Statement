import * as React from 'react';
import { IEntryProps } from './IEntryProps';
import {IEntryState} from './IEntryState';

class Entry extends React.Component<IEntryProps, IEntryState> {

    public constructor(props: IEntryProps,state: IEntryState){
      super(props);
      this.state = {
        toggle: 1,
      }
    }
  
    public handleClick(index: number):any{
      this.setState({toggle : index})
    }
  
    public render(): React.ReactElement<IEntryProps> {
      const {
        
      } = this.props;
  
      return (
        <div>
          Hello All.
        </div>
      );
    }
  }

export default Entry;