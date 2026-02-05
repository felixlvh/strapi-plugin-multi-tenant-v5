const __variableDynamicImportRuntimeHelper = (glob, path, segs) => {
  const v = glob[path];
  if (v) {
    return typeof v === "function" ? v() : Promise.resolve(v);
  }
  return new Promise((_, reject) => {
    (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(
      reject.bind(
        null,
        new Error(
          "Unknown variable dynamic import: " + path + (path.split("/").length !== segs ? ". Note that variables only represent file names one level deep." : "")
        )
      )
    );
  });
};
const PLUGIN_ID = "multi-tenant";
const index = {
  register(app) {
    app.addMenuLink({
      to: `plugins/${PLUGIN_ID}`,
      icon: () => "🏢",
      intlLabel: {
        id: `${PLUGIN_ID}.plugin.name`,
        defaultMessage: "Multi-Tenant"
      },
      Component: async () => {
        const { App } = await import("../_chunks/App-CnIRYDJO.mjs");
        return App;
      },
      permissions: []
    });
    app.registerPlugin({
      id: PLUGIN_ID,
      name: PLUGIN_ID
    });
  },
  bootstrap(app) {
  },
  async registerTrads({ locales }) {
    const importedTranslations = await Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./translations/en.json": () => import("../_chunks/en-DaUXV3Oo.mjs") }), `./translations/${locale}.json`, 3);
          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
    return importedTranslations;
  }
};
export {
  index as default
};
