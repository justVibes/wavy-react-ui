
import("child_process")
  .then(({exec}) => {
    const message = process.argv
      .splice(2)
      .find(
        (v, i, arr) =>
          arr[i - 1]?.toLowerCase() === "-m" && typeof v === "string"
      );
    if (!message) {
      throw new Error(
        "Please add a message before attempting to push to github."
      );
    }
    const cmds = {
      commit: `git commit -m "${message}"`,
      branch: "git branch -M main",
      remote: "git remote add origin https://github.com/justVibes/wavy-ui.git",
      push: "git push -u origin main",
    };

    exec(Object.values(cmds).join(" && "), (error, stdout) => {
      if (error) throw error;
      if (stdout) console.log(stdout);
    });
    // exec(`${cm}`)
    // exec("git commit", (err) => {
    //   if (err) throw err;
    //   exec("git branch -M main && git remote");
    // });
  })
  .catch(console.dir);
