import {
    opine,
    React,
    ReactDOMServer,
    Request,
    Response,
    NextFunction,
  } from "./dep.ts";
  
  import App from "./app.tsx";
  
  const app = opine();
  const browserBundlePath = "/browser.js";
  
  const js =
    `import React from "https://dev.jspm.io/react@16.13.1";\nimport ReactDOM from "https://dev.jspm.io/react-dom@16.13.1";\nconst App = ${App};\nReactDOM.hydrate(React.createElement(App), document.body);`;
  
  const html =
    `<html><head><script type="module" src="${browserBundlePath}"></script><style>* { font-family: Helvetica; }</style></head><body>${
      (ReactDOMServer as any).renderToString(<App />)
    }</body></html>`;
  
  // Note that you wouldn't normally need to specify types for `req`, `res` and `next`.
  // Deno v1.0.1 introduced a bug where it dropped support for `.tsx` files resulting in breaking typescript errors.
  //
  // This should be fixed in Deno v1.0.3.
  //
  // REF:
  // - https://github.com/denoland/deno/issues/5776
  // - https://github.com/denoland/deno/issues/5772
  // - https://github.com/denoland/deno/pull/5785
  app.use(browserBundlePath, (req: Request, res: Response, next: NextFunction) => {
    res.type("application/javascript").send(js);
  });
  
  app.use("/", (req: Request, res: Response, next: NextFunction) => {
    res.type("text/html").send(html);
  });
  
  app.listen({ port: 3000 });
  
  console.log("React SSR App listening on port 3000");