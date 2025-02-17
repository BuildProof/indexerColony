import { Customizable } from "../typings/Customizable";
export declare const $is_custom: <Type extends keyof Customizable>(name: string, type: Type, text: string, value: Customizable[Type]) => boolean;
