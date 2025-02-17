import ts from "typescript";
export interface ICheckEntry {
    expression: ts.Expression;
    tags: ICheckEntry.ITag[];
}
export declare namespace ICheckEntry {
    interface ITag {
        expected: string;
        expression: ts.Expression;
    }
}
