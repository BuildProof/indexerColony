import ts from "typescript";
import { ITransformOptions } from "./transformers/ITransformOptions";
export declare const transform: (program: ts.Program, options?: ITransformOptions) => ts.TransformerFactory<ts.SourceFile>;
export default transform;
