// @ts-check
/** @param {import("github-script").AsyncFunctionArguments} AsyncFunctionArguments  */
module.exports = async ({ context, github }) => {
  const pullRequest = context.payload.pull_request;
  const pull_number = pullRequest?.number;
  const headBranch = pullRequest?.head.ref;
  const baseBranch = pullRequest?.base.ref;

  if (
    pull_number == undefined ||
    baseBranch !== "main" ||
    ["develop", "hotfix"].includes(headBranch)
  ) {
    console.log("No changes has been occurred to the base branch.");
    return;
  }

  await github.rest.pulls.update({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: pull_number,
    base: "develop", // Change the base branch to 'develop'.
  });

  console.log("The base branch has been changed to 'develop'");
};
