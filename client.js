let x = ({ tag = "div", children = [], ...styles }, props) => {
  return React.createElement(tag, { ...props, style: styles }, ...children);
}

let createStore = (reducerFn, initialState) => {
  let state = initialState;
  let subs = [];
  return {
    subscribe: (fn) => {
      subs.push(fn);
      return () => {
        subs.splice(subs.indexOf(fn), 1)
      }
    },
    dispatch: (action) => {
      console.log(`dispatch`, action);
      let newState = reducerFn(state, action);
      if (newState !== state) {
        state = newState;
        subs.forEach(sub => {
          sub();
        });
      }
    },
    getState: () => {
      return state;
    }
  }
}

let connect = (mapStateToProps) => {
  return (Component) => {
    return class extends React.Component {
      _prevProps = undefined;
      componentDidMount() {
        store.subscribe(() => {
          if (this.shouldComponentUpdate(this.props)) {
            console.log(`forceUpdate`, this);
            this.forceUpdate();
          }
        })
      }
      shouldComponentUpdate(nextProps) {
        if (Object.keys(nextProps).find(key => this.props[key] !== nextProps[key])) return true;
        let newMapStateToPropsObject = mapStateToProps(store.getState(), this.props);
        if (Object.keys(newMapStateToPropsObject).find(key => newMapStateToPropsObject[key] !== this._prevProps[key])) return true;
        return false;
      }
      render() {
        return x({ tag: Component }, { ...this.props, ...(this._prevProps = mapStateToProps(store.getState(), this.props)) })
      }
    }
  }
}


let Checkbox = (obj = {}) => {
  return x({
    ...obj,
    alignItems: `center`,
    justifyContent: `center`,
    children: [
      x({ tag: `input`, width: `15px`, height: `15px` }, { type: `checkbox` })
    ]
  })
}
let Input = ({ ...obj } = {}, attrs = {}) => {
  return x({
    ...obj,
    children: [
      x({ tag: `input` }, attrs)
    ]
  })
}

let reducer = (state, action) => {
  if (action.type === `CHANGE_TODO`) {
    state.todos[action.index] = { ...state.todos[action.index], text: action.newText }
    return { ...state }
  }
}
let store = createStore(reducer,
  {
    newTodoText: ``,
    todos: [
      { id: 0, text: `hello0`, creationTime: Math.random(), components: [], notes: [] },
      { id: 1, text: `hello1`, creationTime: Math.random(), components: [], notes: [] },
      { id: 2, text: `hello2`, creationTime: Math.random(), components: [], notes: [] },
      { id: 3, text: `hello3`, creationTime: Math.random(), components: [], notes: [] },
      { id: 4, text: `hello4`, creationTime: Math.random(), components: [], notes: [] },
    ]
  }
);

let Counter = class extends React.Component {
  state = {
    count: 0
  }
  render() {
    return x({
      marginLeft: `10px`,
      marginRight: `10px`,
      children: `count: ${this.state.count}`,
    }, {
      onClick: () => {
        this.setState({ count: this.state.count + 1 });
      }
    })
  }
}

let Note = class extends React.Component {
  render() {
    let { note, onNoteChange } = this.props;
    return x({
      children: [
        x({
          flexDirection: `row`,
          border: `1px solid gray`,
          padding: `10px`,
          children: [
            x({
              flex: 1,
              marginLeft: `10px`,
              children: [
                Input({}, {
                  value: note.text,
                  onChange: (e) => {
                    onNoteChange(e.target.value);
                  }
                })
              ]
            }),
            x({ tag: Counter }),
            x({ tag: Counter }),
            x({
              alignItems: `center`,
              justifyContent: `center`,
              border: `1px solid gray`,
              children: `x`,
            }, {
              onClick: () => {
                onNoteDelete()
              }
            })
          ]
        })
      ]
    })
  }
  shouldComponentUpdate(nextProps) {
    return nextProps.note !== this.props.note;
  }
}

let Todo = connect((state, props) => {
  return {
    todo: state.todos[props.index]
  }
})(class extends React.Component {
  render() {
    let { todo } = this.props;
    return x({
      border: `1px solid gray`,
      children: [
        x({
          flexDirection: `row`,
          padding: `10px`,
          children: [
            Checkbox(),
            x({
              flex: 1,
              marginLeft: `10px`,
              children: [
                Input({}, {
                  value: todo.text,
                  onChange: (e) => {
                    //todo.text = e.target.value;
                    store.dispatch({ type: `CHANGE_TODO`, newText: e.target.value, index: this.props.index })
                  }
                })
              ]
            }),
            x({ tag: Counter }),
            x({ tag: Counter }),
            x({
              alignItems: `center`,
              justifyContent: `center`,
              border: `1px solid gray`,
              children: `x`,
            }, {
              onClick: () => {
                console.log(`delete todo`, todo.id);
                todos.splice(todos.indexOf(todo), 1);
                rerender();
              }
            })
          ]
        }),
        x({
          children: [
            x({ alignSelf: `center`, children: `Notes` }),
            x({
              children: todo.notes.map((note, i) => x({ tag: Note }, {
                key: note.id,
                note,
                onNoteChange: (newValue) => {
                  //todo.notes[i] = { ...note, text: newValue };
                  todos[this.props.index] = { ...todo, notes: todo.notes.map(n => n.id === note.id ? { ...n, text: newValue } : n) };
                  rerender();
                }
              }))
            }),
            x({
              tag: `button`,
              alignSelf: `center`,
              children: `add note`
            }, {
              onClick: () => {
                todos[this.props.index] = { ...todo, notes: [{ id: todo.notes.length, text: `` }] };
                rerender();
              }
            })
          ]
        })
      ]
    })
  }
})

let App = connect((state) => ({ newTodoText: state.newTodoText, todos: state.todos }))(class extends React.Component {
  state = {
    count: 0
  }
  render() {
    let { newTodoText, todos } = this.props;
    return x({
      flex: 1,
      overflow: `scroll`,
      padding: `50px`,
      children: [
        x({
          children: `count: ${this.state.count}`,
        }, {
          onClick: () => this.setState({ count: this.state.count + 1 })
        }),
        x({
          alignItems: `center`,
          fontSize: `20px`,
          children: `Todos`
        }),
        x({
          marginTop: `15px`,
          flexDirection: `row`,
          children: [
            Input({
              flex: `1`,
              border: `1px solid gray`
            }, { value: newTodoText, onChange: (e) => { newTodoText = e.target.value; rerender(); } }),
            x({
              tag: `button`,
              marginLeft: `10px`,
              children: `add todo`,
            }, {
              onClick: () => {
                todos.push({ id: todos.length, text: newTodoText, creationTime: Math.random(), count: 0 });
                newTodoText = ``;
                rerender();
              }
            })
          ]
        }),
        x({
          marginTop: `15px`,
          keyed: true,
          children: todos.map((todo, i) => x({ tag: Todo }, { key: todo.id, index: i }))
        }),
      ]
    });
  }
});

let rerender = () => {
  ReactDOM.render(React.createElement(App), document.body.firstElementChild);
}
rerender();



