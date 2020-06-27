
/**
 * Get the parents page origin.
 * Note this relies on document.referrer not 
 * being spoofable but the containing page, which 
 * I'm pretty sure is the case, but can't find 
 * any solid reference on it. 
 * 
 */
export function getParentOrigin() {
  var a = document.createElement("a");
  a.href = document.referrer;
  a.style.display = "none";
  document.body.appendChild(a);
  const origin = a.origin;
  document.body.removeChild(a);
  return origin;
}


