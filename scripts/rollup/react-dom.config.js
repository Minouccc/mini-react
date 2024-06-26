import {
  getBaseRollupPlugins,
  getPackageJSON,
  resolvePkgPath,
} from "./utils.js";

import generatePackageJson from "rollup-plugin-generate-package-json";
import alias from "@rollup/plugin-alias";

// 获取package.json下面的name字段
const { name, module } = getPackageJSON("react-dom"); // react-dom
// react-dom包的路径
const pkgPath = resolvePkgPath(name);
//react-dom产物路劲
const pkgDistPath = resolvePkgPath(name, true);
export default [
  // 对应react-dom
  {
    input: `${pkgPath}/${module}`,
    output: [
      {
        file: `${pkgDistPath}/index.js`,
        name: "index.js",
        format: "umd",
      },
      {
        file: `${pkgDistPath}/client.js`,
        name: "client.js",
        format: "umd",
      },
    ],
    plugins: [
      // webpack resolve alias
      alias({
        entries: {
          hostConfig: `${pkgPath}/src/hostConfig.ts`,
        },
      }),
      ...getBaseRollupPlugins(),
      generatePackageJson({
        inputFolder: pkgPath,
        outputFolder: pkgDistPath,
        baseContents: ({ name, description, version }) => ({
          name,
          description,
          peerDependencies: {
            react: version,
          },
          version,
          main: "index.js",
        }),
      }),
    ],
  },
];
