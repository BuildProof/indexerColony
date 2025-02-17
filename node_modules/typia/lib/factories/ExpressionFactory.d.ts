import ts from "typescript";
export declare namespace ExpressionFactory {
    const isRequired: (input: ts.Expression) => ts.Expression;
    const isArray: (input: ts.Expression) => ts.Expression;
    const isObject: (options: {
        checkNull: boolean;
        checkArray: boolean;
    }) => (input: ts.Expression) => ts.Expression;
    const isInstanceOf: (type: string) => (input: ts.Expression) => ts.Expression;
    const coalesce: (x: ts.Expression) => (y: ts.Expression) => ts.Expression;
}
