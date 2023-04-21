import React from 'react';
import List from 'react-virtualized/dist/es/List';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';

interface RowMeta {
  isChecked: boolean;
}

interface GroupMeta extends RowMeta {
  numTotal: number;
  numChecked: number;
  expanded: boolean;
}

enum GroupsActionType {
  Check = '+',
  Uncheck = '-',
  Nothing = ''
}

interface GroupAction {
  type: GroupsActionType;
  id: number;
}

interface GroupsStackFrame {
  action: GroupsActionType,
  group: Group;
}

function getAction(stack: Array<GroupsStackFrame>) {
  for (let frame of stack) {
    if (frame.action !== GroupsActionType.Nothing) {
      return frame.action;
    }
  }
  return GroupsActionType.Nothing;
}

function isVisible(elem: TreeElement,
                   stack: Array<GroupsStackFrame>): boolean {
  for (let frame of stack) {
    if (frame.group.id === elem.id) {
      continue;
    }
    if (!frame.group.meta.expanded) {
      return false;
    }
  }
  return true;
}

interface RawData {
  id: number;
  haschild: boolean;
  higher: number|null;
  level: number;
  name: string;
}

interface Row extends RawData {
  meta: RowMeta;
}

interface Group extends RawData {
  meta: GroupMeta;
}

type TreeElement = Row|Group;

function isRow(r: TreeElement): r is Row {
  return !r.haschild;
}

function isGroup(r: TreeElement): r is Group {
  return r.haschild;
}


interface ArcticTreeState {
  //Model
  tree: Array<TreeElement>;
  filter: string;

  //ViewModel
  expanded: Set<number>;
}

interface ArcticTreeProps {}

class ArcticTree extends React.Component<ArcticTreeProps, ArcticTreeState> {
  private checked: Set<number> = new Set();
  protected storage: Array<RawData> = [];

  constructor(props: ArcticTreeProps) {
    super(props);
    this.state = {
      tree: [],
      filter: '',
      expanded: new Set()
    };
  }

  handleExpandToggle(event: any, id: number) {
    event.preventDefault();
    const current = this.state.expanded;
    if (current.has(id)) {
      const next = this.state.expanded;
      next.delete(id);
      this.setState({expanded: new Set(next)});
    } else {
      this.setState({expanded: new Set(this.state.expanded.add(id))});
    }
    this.doNextRun();
  }

  handleRowCheckToggle(event: any, id: number) {
    event.preventDefault();
    if (this.checked.has(id)) {
      this.checked.delete(id);
    } else {
      this.checked.add(id);
    }
    this.doNextRun();
  }

  handleGroupCheckToggle(event: any, id: number, checked: boolean) {
    event.preventDefault();
    if (!checked) {
      this.doNextRun({id: id, type: GroupsActionType.Check});
      console.log(`Group toggle ${id} + `);
    } else {
      this.doNextRun({id: id, type: GroupsActionType.Uncheck});
      console.log(`Group toggle ${id} - `);
    }
  }

  isExpanded(row: Row) {
    return this.state.expanded.has(row.id);
  }

  expandBtn(row: Group) {
    function _b(g: Group) {
      return g.meta.expanded? " - " : " + " 
    }
    return <a onClick={e=>(this.handleExpandToggle(e, row.id))} href="#">
      {_b(row)} 
    </a>
  }

  checkbox(row: TreeElement) {
    function _b(flag: boolean) {
      return flag? "☑" : "☐" 
    }
    if (isGroup(row)) {
      const checked = row.meta.numChecked > 0;
      const isGrey = checked && (row.meta.numChecked < row.meta.numTotal);

      return [
        ` ${row.meta.numChecked} of ${row.meta.numTotal} `,
        <a href="#"
          onClick={e=>this.handleGroupCheckToggle(e, row.id, checked)}
          style={isGrey? {color: "grey"}: {}}>
          {_b(checked)}
        </a>
      ]
      } else {
      return [' ',
        <a href="#" onClick={e=>this.handleRowCheckToggle(e, row.id)}>
            {_b(row.meta.isChecked)}
        </a>,
      ' ']
    }
  }

  doNextRun(groupAction?: GroupAction) {
    const w = this;
    const output: Array<TreeElement> = [];
    const stack: Array<GroupsStackFrame> = [];
    const nextChecked: Set<number> = new Set();
    let level = 1;

    for (let _row of w.storage) {
      const elem = _row as TreeElement; 
      
      if (elem.level < level) { //If exit
        for (;level !== _row.level; --level) {
          stack.pop();
        }
      }

      if (isGroup(elem)) {
        let action = GroupsActionType.Nothing;
        elem.meta = {
          isChecked: false,  
          numTotal: 0,
          numChecked: 0,
          expanded: this.state.expanded.has(elem.id)
        }
        if (groupAction &&  groupAction.id === elem.id) {
          action = groupAction.type;
        }
        stack.push({action: action, group: elem});
      } else {
        let action = getAction(stack);
        let checked = false;
        if (action !== GroupsActionType.Nothing) {
          checked = action === GroupsActionType.Check? true: false;
        } else {
          checked = this.checked.has(elem.id);
        }
        elem.meta = {
          isChecked: checked
        }
        if (checked) {
          nextChecked.add(elem.id);
        }
      }

      if (isRow(elem)) {
        for (let frame of stack) {
          frame.group.meta.numTotal += 1;
          if (elem.meta.isChecked) {
            frame.group.meta.numChecked +=1;
          }
        }
      }

      if (elem.level > level) { //Inner
        if (elem.level !== level + 1) {
          throw 'Broken tree, level invariant check failed ';
        };
        ++level;
      }

      if (elem.level === 1 || isVisible(elem, stack)) {
        output.push(elem);
      }
    }
    this.checked = nextChecked;
    this.setState({tree: output});
    this.forceUpdate();
  }

  render() {
    const rowRenderer = (params: any) => {
      const row = this.state.tree[params.index];
      
      const rowCss = {
        paddingLeft: `${row.level * 30}px`,
        ...params.style
      };

      const rowContent = <span>
        { isGroup(row)? this.expandBtn(row): null }  
        { row.name }
        { this.checkbox(row) }
      </span>;
      
      return <div key={params.key} className={"row"} style={rowCss}>
        { rowContent }
      </div>;
    };
    
    const listFactory = ({width, ..._}) => {
      return <List className={"List"}
        overscanRowCount={10}
        style={{textAlign: "left"}}
        width={width}
        height={500}
        rowCount={this.state.tree.length}
        rowHeight={20}
        rowRenderer={rowRenderer} />
    };
    
    return <div className="ArcticTree">
      checked rows: {this.checked}<br/>
      expanded rows: {this.state.expanded}<br/>
      <AutoSizer disableHeight>{listFactory}</AutoSizer>
    </div>;
  }
}

export default ArcticTree;

