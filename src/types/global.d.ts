declare module '*.css' {
  const styles: any;
  export = styles;
}

declare module '*.scss' {
  const styles: any;
  export = styles;
}

declare module "*.json" {
  const value: any;
  export default value;
}

// for redux devtools extension
declare interface Window {
  devToolsExtension?(): (args?: any) => any;
}
