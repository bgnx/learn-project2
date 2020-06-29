let x = ({ tag = "div", children = [], ...styles }, props) => {
  return React.createElement(tag, { ...props, style: styles }, ...children);
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

let todos = [
  { id: 0, text: `hello0`, creationTime: Math.random(), components: [] },
  { id: 1, text: `hello1`, creationTime: Math.random(), components: [] },
  { id: 2, text: `hello2`, creationTime: Math.random(), components: [] },
  { id: 3, text: `hello3`, creationTime: Math.random(), components: [] },
  { id: 4, text: `hello4`, creationTime: Math.random(), components: [] },
];
for (let i = 0; i < 1000; i++) {
  todos.push({ id: todos.length, text: `hello${todos.length}`, creationTime: Math.random(), count: 0, components: [] });
}
let newTodoText = ``;

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

let Todo = class extends React.Component {
  componentDidMount() {
    this.props.todo.components.push(this);
  }
  render() {
    let { todo } = this.props;
    return x({
      flexDirection: `row`,
      border: `1px solid gray`,
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
                todo.text = e.target.value;
                //rerender();
                todo.components.forEach(component => { //2
                  component.forceUpdate();
                })
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
    })
  }
  componentWillUnmount() {
    console.log(`componentWillUnmount ${this.props.todo.id}`)
  }
}

let App = class extends React.Component {
  state = {
    count: 0
  }
  render() {
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
          children: todos.map((todo, i) => x({ tag: Todo }, { todo: todo, key: todo.id }))
        }),
        x({
          marginTop: `10px`,
          children: [
            x({
              children: [
                x({ children: `sort by creation time` }),
                x({
                  children: todos.slice().sort((a, b) => a.creationTime - b.creationTime).map(todo => x({ tag: Todo }, { todo: todo, key: todo.id }))
                })
              ]
            })
          ]
        })
      ]
    });
  }
}

let rerender = () => {
  ReactDOM.render(React.createElement(App), document.body.firstElementChild);
}
rerender();

