import ts from "typescript";
import { IMetadataTag } from "../metadata/IMetadataTag";
import { Metadata } from "../metadata/Metadata";
export declare namespace MetadataTagFactory {
    const generate: (metadata: Metadata) => (tagList: ts.JSDocTagInfo[]) => (identifier: () => string) => IMetadataTag[];
}
