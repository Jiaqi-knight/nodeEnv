module.exports = {
  "hooks": {
    // "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
    "prepare-commit-msg": "exec < ./ && git cz --hook || true",
  }
}