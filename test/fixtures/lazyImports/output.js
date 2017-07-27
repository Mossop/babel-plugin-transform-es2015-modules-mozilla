const {
  XPCOMUtils
} = Components.utils.import("resource://gre/modules/XPCOMUtils.jsm", {});
XPCOMUtils.defineLazyModuleGetter(this, "foo", "bar");
const {
  a,
  b
} = Components.utils.import("c", {});
XPCOMUtils.defineLazyModuleGetter(this, "d", "e", "c");
