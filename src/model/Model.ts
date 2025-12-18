const Model = <T, P>(fn: (args: P) => T) => {
  return fn;
};
export default Model;
