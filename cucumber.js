module.exports = {
  default: [
    "--require-module ts-node/register",
    "--require features/**/*.ts",
  ].join(" "),

  critical: [
    "--require-module ts-node/register",
    "--require features/**/*.ts",
    "--tags @critical"
  ].join(" "),
};
