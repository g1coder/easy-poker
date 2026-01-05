type CX = (...a: Array<undefined | null | string | boolean>) => string;

export const cx: CX = (...args) => args.flat().filter(Boolean).join(" ");
