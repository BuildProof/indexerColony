import ts from "typescript";
export declare namespace StatementFactory {
    const constant: (name: string, initializer?: ts.Expression) => ts.VariableStatement;
    const transpile: (script: string) => ts.ExpressionStatement;
}
