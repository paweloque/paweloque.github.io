/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "_" }] */
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
/* global Vue */

(function() {
    // "use strict";

    function tokenize(text) {
        if (text.split("(").length !== text.split(")").length) {
            throw SyntaxError("Parentheses missmatch.");
        }
        let line = 1, col = 1, result = [];
        let token_index = 0;
        for (let token of text.split(/(\(|\)| |\n)/)) {
            let node = null;
            if (token === ""){
                //nothing
            } else if (token === " ") {
                col += 1;
            } else if (token === "\n") {
                col = 1;
                line += 1;
            } else if (token[0] in "1234567890".split("")) {
                node = new Number(token);
                if (Number.isNaN(node.valueOf())) {
                    throw new SyntaxError(`Not a number: ${token} (Line: ${line}, column: ${col})`);
                }
                node.line = line;
                node.col = col;
                node.length = token.length;
            } else {
                node = new String(token);
                node.line = line;
                node.col = col;
            }
            
            // finish up node creation
            if (node) {
                // set token id
                node.id = 'token_' + token_index;
                // push
                result.push(node);
                col += token.length;
                token_index += 1;
            }
        }
        return result;
    }

    function parse(tokens) {
        var current = ["begin"];
        const stack = [current];

        for (let token of tokens) {
            if (token.valueOf() === "(") {
                let old = current;
                current = [];
                current.line = token.line;
                current.col = token.col;
                old.push(current);
                stack.push(current);
            } else if (token.valueOf() === ")") {
                if (stack.length === 1) {
                    throw SyntaxError("Do not close the main 'begin' block.");
                }
                let old = stack.pop();
                old.end_line = token.line;
                old.end_col = token.col;
                current = stack[stack.length - 1];
            } else {
                current.push(token);
            }
        }
        if (stack.length > 1) {
            throw SyntaxError("Program not finished."); // Should not happen
        }
        return stack[0];
    }

    const global_env = {
        "+": (a, b) => a + b,
        "-": (a, b) => a - b,
        "*": (a, b) => a * b,
        "/": (a, b) => a / b,
        "=": (a, b) => a === b,
        "!=": (a, b) => a !== b,
        ">": (a, b) => a > b,
        ">=": (a, b) => a >= b,
        "<": (a, b) => a < b,
        "<=": (a, b) => a <= b,
    };

    function* evaluate(x, env) {
        if (x instanceof String) {
            const res = env[x.valueOf()];
            if (typeof res === "undefined") {
                throw Error("Variable '" + x + "' not found");
            }
            x.started = true;
            yield x;
            return env[x];
        } else if (x instanceof Number) {
            x.doing = true;
            yield x;
            return x.valueOf();
        } else if (x[0].valueOf() === "begin") {
            if (x.length < 2) {
                throw Error("At least one expression required in begin block.");
            }
            const [_, ...exps] = x;

            // because we're yield'ing map is not allowed...
            // 
            // return exps.map(exp => evaluate(exp, env)).slice(-1)[0];
            // 
            var last_evald = undefined;
            for (var i=0; i<exps.length; i++) {
                last_evald = yield* evaluate(exps[i], env);
            }
            return last_evald
        } else {
            // Function call (no special form)
            const func_name = typeof x[0] === "string" ? x[0] : "<anon>";

            // because we're yield'ing map is not allowed...
            // 
            // const [func, ...args] = x.map(exp => yield * evaluate(exp, env));
            // 
            var evald = []
            var first_tok, last_tok;
            for (var i=0; i<x.length; i++) {
                let oneeval = yield* evaluate(x[i], env);
                evald.push(oneeval);
                first_tok = x[0];
                last_tok = x[x.length-1];
            }
            const [func, ...args] = evald;

            if (typeof func === "function") {
                // Native JavaScript function call
                let func_result = func(...args);
                first_tok.started = false;
                first_tok.doing = true;
                yield first_tok;

                return func_result;
            } else if (func instanceof Array) {
                // MiniScheme function call
                const [_, arg_names, body, definition_env] = func;
                if (arg_names.length !== args.length) {
                    throw Error("Wrong number of arguments for function " +
                        func_name + ". " + args.length + " supplied, " +
                        arg_names.length + " needed.");
                }

                // Create a new function calling environment with the supplied
                // argument names and values. Link to the environment at
                // function definition as outer environment.
                const call_env = arg_names.reduce(function(env, name, i) {
                    env[name] = args[i];
                    return env;
                }, Object.create(definition_env));

                // Evaluate the function body with the newly created environment
                return evaluate(body, call_env);
            }
        }
    }

    Vue.component("item", {
        template: "#item-template",
        props: ["model", "index", "parentToggle", "parentModel"],
        data: function() {
            return {
                collapsed: false,
            };
        },
        computed: {
            isList: function() {
                return this.model instanceof Array;
            },
            isLambdaArgList: function() {
                return this.isList
                    && this.index === 1
                    && this.parentModel[0].valueOf() === "lambda";
            },
        },
        methods: {
            click: function(event) {
                if (!this.isList) {  //
                    event.stopPropagation();
                    if (this.index === 0) {
                        this.parentToggle();
                    }
                    return false;
                }
            },
            toggle: function() {
                if (!this.isLambdaArgList) {
                    this.collapsed = !this.collapsed;
                }
            },
        },
    });

    const vm = new Vue({
        el: "#app",
        data: {
            input: "",
            tokens: [],
            ast: [],
            env: {},
            global_env: global_env,
            result: undefined,
            error: false,
            debug: true,
            eval_gen: undefined,
        },
        computed: {
            parenBalance: function() {
                return this.input.split("(").length -
                       this.input.split(")").length;
            }
        },
        methods: {
            debuggerStep: function() {
                var {value: result, done} = this.eval_gen.next();
                
                // tell vue to update token list
                let token_idx = this.tokens.findIndex(el => el.id == result.id);
                Vue.set(this.tokens, token_idx, result);
                if (!done) {
                    return result;
                }

                // we're done stepping: reset eval_gen to null
                this.eval_gen = null;
                this.processResult(result);
            },
            debuggerContinue: function() {
                while (!done) {
                    var {value: result, done} = this.eval_gen.next();
                }

                // we're done stepping: reset eval_gen to null
                this.eval_gen = null;
                this.processResult(result);
            },
            processResult: function(result) {
                // return final result
                if (result instanceof Array) {
                    const pprint = tree => tree instanceof Array ?
                        "(" + tree.map(pprint).join(" ") + ")" : tree;
                    this.result = pprint(result.slice(0, -1));
                } else if (typeof result === "function") {
                    this.result = "native function: " + result.name;
                } else {
                    this.result = result;
                }
            }
        },
        watch: {
            input: function(val) {
                this.ast = [];
                this.result = undefined;
                this.error = false;
                try {
                    this.tokens = tokenize(val);
                    this.ast = parse(this.tokens.slice());
                    this.env = Object.create(this.global_env);

                    this.eval_gen = evaluate(this.ast, this.env);
                } catch (error) {
                    this.error = error;
                }
            }
        },
    });

    // Example input:
    vm.input = `(+ (+ 2 2) 5)`;

    vm.input_ = `(define abs  (lambda (a) (if (> a 0) a (- 0 a))))
(define avg  (lambda (a b) (/ (+ a b) 2) ))
(define sqrt (lambda (x) (begin
    (define start_guess 1)
    (define tolerance 0.000001)
    (define good_enough? (lambda (guess)
        (<= (abs (- x (* guess guess))) tolerance)
    ))
    (define sqrt_iter (lambda (guess)
        (if (good_enough? guess) guess (sqrt_iter (avg guess (/ x guess))))
    ))
    (sqrt_iter start_guess))))
(sqrt 2)`;
}());
