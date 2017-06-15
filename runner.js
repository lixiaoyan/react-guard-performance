const argv = require("yargs").argv;
const name = argv.name || "benchmark";
const useGuard = Boolean(argv.useGuard);
const seed = argv.seed || String(Math.random());
const error = Number(argv.error) || 0;

const React = require("react");
const ReactDOMServer = require("react-dom/server");
const reactGuard = require("react-guard");

if (useGuard) {
  reactGuard(React);
}

const rand = require("random-seed").create(seed);

const render = () => {
  if (rand.random() < error) {
    throw new Error("mock error");
  }
  return (
    React.createElement("div", null, "content")
  );
};

const Component = class extends React.Component {
  render() {
    return render();
  }
};

const StatelessComponent = () => {
  return render();
};

const App = () => {
  return (
    React.createElement("div", null, (
      Array.from({ length: 10 })
        .map((value, index) => React.createElement(Component, { key: `Component-${index}` }))
    ), (
      Array.from({ length: 10 })
        .map((value, index) => React.createElement(StatelessComponent, { key: `StatelessComponent-${index}` }))
    ))
  );
};

const Benchmark = require("benchmark");

const benchmark = new Benchmark(name, () => {
  ReactDOMServer.renderToString(React.createElement(App));
});

benchmark.on("error", event => {
  throw event.target.error;
});

benchmark.on("complete", event => {
  console.log(String(event.target));
});

benchmark.run();
