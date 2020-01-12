import React from 'react';
import ReactDOM from 'react-dom';
import marked from 'marked';
import Redux, {createStore} from 'redux';
import './index.css';
marked.setOptions({
  breaks: true
});

/*const windows = (
  state = [{ id: 0, fullscreen: false }, { id: 1, fullscreen: false }],
  action
) => {
  switch (action.type) {
    case "CHANGE_SIZE": {
      return state.map(window => {
        if (action.id == window.id)
          return {
            ...window,
            fullscreen: !window.fullscreen
          };
        else
          return {
            ...window,
            fullscreen: false
          };
      });
    }
    default: {
      return state;
    }
  }
};*/
const windows = (
  state = [{ id: 0, fullscreen: 2 }, { id: 1, fullscreen: 0 }],
  action
) => {
  switch (action.type) {
    case "MINIMIZE":
      return state.map(window => {
        return {
          id: window.id,
          fullscreen: 1
        };
      });
      break;
    case "MAXIMIZE":
      return state.map(window => {
        if (action.id == window.id) {
          return {
            id: window.id,
            fullscreen: 2
          };
        } else {
          return {
            id: window.id,
            fullscreen: 0
          };
        }
      });
      break;
    default:
      return state;
      break;
  }
};
const store = createStore(windows);

let defVal = `# Welcome to my React Markdown Previewer!

## This is a sub-heading...
### And here's some other cool stuff:

Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == \'\`\`\`\' && lastLine == \'\`\`\`\') {
    return multiLineCode;
  }
}
\`\`\`

You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There's also [links](https://www.freecodecamp.com), and
> Block Quotes!

And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | -------------
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbererd lists too.
1. Use just 1s if you want!
1. But the list goes on...
- Even if you use dashes or asterisks.
* And last but not least, let's not forget embedded images:

![React Logo w/ Text](https://goo.gl/Umyytc)
`;
class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: defVal,
      id: props.windows[0].id,
      fullscreen: props.windows[0].fullscreen
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  handleChange(event) {
    this.setState({ input: event.target.value });
    document.getElementById("preview").innerHTML = marked(event.target.value);
  }
  handleClick() {
    if (this.props.windows[0].fullscreen == 1) {
      store.dispatch({
        type: "MAXIMIZE",
        id: 0
      });

      document.getElementById("all").style = "height: 100vh; overflow: hidden";
    } else {
      store.dispatch({
        type: "MINIMIZE",
        id: 0
      });
      document.getElementById("all").style = " ";
    }
  }
  componentDidMount() {
    document.getElementById("preview").innerHTML = marked(
      this.state.input
    ); /*
    if (this.state.fullscreen) this.setState({ adCl: "fullyscreenbox" });
    else this.setState({ adCl: "box" });*/
  }
  render() {
    return (
      <div
        id="box"
        className={
          this.props.windows[0].fullscreen == 0
            ? "hided"
            : this.props.windows[0].fullscreen == 1 ? "box" : "fullyscreenbox"
        }
      >
        <div class="greenBox">
          <i class="fab fa-free-code-camp"> </i>
          <pre> </pre>Editor{" "}
          <div class="fullscreen">
            <button onClick={this.handleClick}>
              <i class="fa fa-arrows-alt" />
            </button>
          </div>
        </div>
        <textarea
          id="editor"
          value={this.state.input}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}
class MyPreviewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      id: 1,
      fullscreen: props.windows[1].fullscreen
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    if (this.props.windows[1].fullscreen == 1)
      store.dispatch({
        type: "MAXIMIZE",
        id: 1
      });
    else
      store.dispatch({
        type: "MINIMIZE",
        id: 1
      });
  }
  render() {
    return (
      <div
        id="box2"
        className={
          this.props.windows[1].fullscreen == 0
            ? "hided"
            : this.props.windows[1].fullscreen == 1 ? "box2" : "fullyscreenbox"
        }
      >
        <div id="previewer" class="greenBox">
          <i class="fab fa-free-code-camp"> </i>
          <pre> </pre>Previewer{" "}
          <div class="fullscreen">
            <button onClick={this.handleClick}>
              <i class="fa fa-arrows-alt" />
            </button>
          </div>
        </div>
        <div id="preview" />
      </div>
    );
  }
}

const render = () => {
  ReactDOM.render(
    <div id="app">
      <MyEditor windows={store.getState()} />
      <MyPreviewer windows={store.getState()} />
    </div>,
    document.getElementById("app")
  );
};

store.subscribe(render);
render();
