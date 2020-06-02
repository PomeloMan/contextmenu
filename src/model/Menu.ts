export class Menu {
  id?: string;
  name: string;
  children?: Menu[];
  handler?: Function = () => { };
}