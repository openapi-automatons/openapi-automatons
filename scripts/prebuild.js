import fs from "fs-extra";
import paths from "../config/paths.js";

fs.removeSync(paths.build);
