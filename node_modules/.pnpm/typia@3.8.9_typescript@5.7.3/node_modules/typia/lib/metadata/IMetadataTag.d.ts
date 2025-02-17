export type IMetadataTag = IMetadataTag.IType | IMetadataTag.IMinimum | IMetadataTag.IMaximum | IMetadataTag.IExclusiveMinimum | IMetadataTag.IExclusiveMaximum | IMetadataTag.IMultipleOf | IMetadataTag.IStep | IMetadataTag.IFormat | IMetadataTag.IPattern | IMetadataTag.ILength | IMetadataTag.IMinLength | IMetadataTag.IMaxLength | IMetadataTag.IItems | IMetadataTag.IMinItems | IMetadataTag.IMaxItems;
export declare namespace IMetadataTag {
    interface IType {
        kind: "type";
        value: "int" | "uint";
    }
    interface IMinimum {
        kind: "minimum";
        value: number;
    }
    interface IMaximum {
        kind: "maximum";
        value: number;
    }
    interface IExclusiveMinimum {
        kind: "exclusiveMinimum";
        value: number;
    }
    interface IExclusiveMaximum {
        kind: "exclusiveMaximum";
        value: number;
    }
    interface IMultipleOf {
        kind: "multipleOf";
        value: number;
    }
    interface IStep {
        kind: "step";
        value: number;
    }
    interface IFormat {
        kind: "format";
        value: "uuid" | "email" | "url" | "ipv4" | "ipv6" | "date" | "datetime";
    }
    interface IPattern {
        kind: "pattern";
        value: string;
    }
    interface ILength {
        kind: "length";
        value: number;
    }
    interface IMinLength {
        kind: "minLength";
        value: number;
    }
    interface IMaxLength {
        kind: "maxLength";
        value: number;
    }
    interface IItems {
        kind: "items";
        value: number;
    }
    interface IMinItems {
        kind: "minItems";
        value: number;
    }
    interface IMaxItems {
        kind: "maxItems";
        value: number;
    }
}
