"use strict";
exports.__esModule = true;
var React = require("react");
var ReactDOM = require("react-dom");
var RD = require("@devexperts/remote-data-ts");
var react_1 = require("react");
var supabase_js_1 = require("@supabase/supabase-js");
var function_1 = require("fp-ts/lib/function");
var _1 = require("../.");
var client = supabase_js_1.createClient('https://uxtxhzqpveqocjohidmf.supabase.co', process.env.SUPABASE_ANON_KEY);
var App = function () {
    return (<_1.Provider value={client}>
      <Consumer />
    </_1.Provider>);
};
var Consumer = function () {
    var result = _1.useTable('test')[0];
    var _a = _1.useInsert('test'), insertResult = _a[0], execute = _a[1];
    var _b = react_1.useState(''), input = _b[0], setInput = _b[1];
    var onSubmit = function (e) {
        e.preventDefault();
        execute({ text: input }).then(function () { return setInput(''); });
        // TODO: Use reexecute to rerender page
    };
    return function_1.pipe(result, RD.fold3(function_1.constant(<div>Loading...</div>), function (e) { return <div>Query failed: {e}</div>; }, function (result) { return (<>
          <h1>Rows</h1>
          <form onSubmit={onSubmit}>
            Create a new entry:{' '}
            <input type="text" value={input} onChange={function (e) { return setInput(e.target.value); }} disabled={RD.isPending(insertResult)}/>
          </form>
          <div>
            {result.map(function (row) { return (<div key={row.id}>
                <h3>{row.text}</h3>
                {row.optional && <p>{row.optional}</p>}
              </div>); })}
          </div>
        </>); }));
};
ReactDOM.render(<App />, document.getElementById('root'));
