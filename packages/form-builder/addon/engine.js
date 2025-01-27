import Engine from "ember-engines/engine";
import loadInitializers from "ember-load-initializers";
import Resolver from "ember-resolver";

import config from "./config/environment";

const { modulePrefix } = config;

/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
const Eng = Engine.extend({
  modulePrefix,
  Resolver,

  dependencies: {
    services: ["apollo", "notification", "intl", "caluma-options", "validator"],
  },
});

loadInitializers(Eng, modulePrefix);

export default Eng;
