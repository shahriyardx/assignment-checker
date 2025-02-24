import * as acorn from "acorn"
import * as walker from "acorn-walk"
import assert from "assert"

const jsonData = {
    type: "code",
    fuctions: [
        {
            name: "cashOut",
            testCases: [
                {input: [2000], output: 35 },
                {input: [100], output: 1.75 },
                {input: [0], output: 0 },
                {input: 101, output: "__string" },
                {input: "mewauu", output: "__string" }
            ]
        }
    ]
}

const validFunctionNames = jsonData.fuctions.map(fn => fn.name)

const code_string = `
function cashOut(income, expanse) {
    return income - expanse
}

function cashOut2(income, expanse) {
    function cashOut3(income, expanse) {
        return income - expanse
    }

    return income - expanse
}
`

const functions = {}

const ast = acorn.parse(code_string, { ecmaVersion: 2020 })


walker.simple(ast, {
    FunctionDeclaration(node) {
        if (validFunctionNames.includes(node.id.name)) {
            const functionName = node.id.name;

            const functionString = code_string.slice(node.start, node.end)
            functions[functionName] = eval(`(${functionString})`);
        }
    }
})

// console.log(functions["cashOut"](5000, 2000))

console.log(assert.deepStrictEqual({a: 1}, {a: 2}))