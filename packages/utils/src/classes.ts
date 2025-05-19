export function cx(
  ...classes: Array<
    string | Record<string, boolean | null | undefined> | null | undefined
  >
): string {
  // class helper that turns a list of classes into a single string
  // if one of the classes is an object, it will add the key if the value is truthy

  // e.g. cx("foo", "bar") => "foo bar"
  // e.g. cx("foo", { bar: true }) => "foo bar"
  return classes
    .map(cls => {
      if (typeof cls === "string") {
        return cls;
      } else if (typeof cls === "object" && cls !== null) {
        return Object.keys(cls)
          .filter(key => cls[key])
          .join(" ");
      }
      return "";
    })
    .filter(Boolean)
    .join(" ");
}

export default cx;
