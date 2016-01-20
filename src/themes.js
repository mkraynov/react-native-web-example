Themes.register({
  brandColorDefault: "red",
  brandColorAccent: "blue",
  dom2: {
    "headerColor": (t)=>t.get("brandColorDefault", "black")
  }
});

Themes.override("dark", {
  brandColorDefault: (t)=>t.dom2.headerColor
});
