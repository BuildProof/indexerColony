import ts from "typescript";
import { IMetadataTag } from "../../metadata/IMetadataTag";
export declare namespace RandomRanger {
    interface IDefaults {
        minimum: number;
        maximum: number;
        gap: number;
    }
    const length: (coalesce: (method: string) => ts.Expression) => (defs: IDefaults) => (acc: length.IAccessors) => (tags: IMetadataTag[]) => ts.Expression | undefined;
    namespace length {
        interface IAccessors {
            minimum: IMetadataTag["kind"];
            maximum: IMetadataTag["kind"];
            fixed: IMetadataTag["kind"];
        }
    }
    const number: (config: number.IConfig) => (defs: IDefaults) => (tags: IMetadataTag[]) => ts.Expression;
    namespace number {
        interface IConfig {
            setter: (args: number[]) => ts.Expression;
            transform: (value: number) => ts.Expression;
            type: "int" | "uint" | "double";
        }
    }
}
