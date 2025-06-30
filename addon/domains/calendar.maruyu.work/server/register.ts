import { DOMAIN } from "../const"
import AbstractAddon from "../../../server/addon";

class Addon extends AbstractAddon {
}


export default (registerHandler: (domain: string, addon: typeof AbstractAddon) => void): void => {
  registerHandler(DOMAIN, Addon)
}