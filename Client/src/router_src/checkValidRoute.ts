/**
 * @notExported
 * Type to check if the route is valid
 */
type ValidRoute<T extends Readonly<string>> = T extends `${infer _}?${infer _}/${infer _}` ? never : T;

/** Check if the route is valid */
export const checkValidRoute = <T extends Readonly<string>>(t: ValidRoute<T>) => t;
