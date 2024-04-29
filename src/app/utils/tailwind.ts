import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfg from "../../../tailwind.config";

const twConfig = resolveConfig(tailwindConfg);
const mdBreakPoint = Number.parseInt((twConfig.theme?.screens as any).md);

export { mdBreakPoint };
