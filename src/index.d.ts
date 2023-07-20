/*~ If this module is a UMD module that exposes a global variable 'myFuncLib' when
 *~ loaded outside a module loader environment, declare that global here.
 *~ Otherwise, delete this declaration.
 */
export as namespace web3account;
/*~ This declaration specifies that the function
 *~ is the exported object from the file
 */
export = registerUser;

declare function registerUser(username: string): Promise<void>;
