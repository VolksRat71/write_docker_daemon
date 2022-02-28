const fs = require("fs");

async function dataReadAndCreate() {
  const resolv = await fs
    .readFileSync("/etc/resolv.conf", "utf8")
    .split("\n")
    .filter((i) => !i.includes("#") && i !== "");

  const daemonData = resolv.map((i) => {
    let key;
    const arr = i.split(" ");

    // To add more options, please insert into this switch
    switch (arr[0]) {
      case "search":
        key = "dns-search";
        break;
      case "nameserver":
        key = "dns";
        break;
      default:
        return "unknown";
    }

    arr[0] = key;
    arr[1] = [arr[1]];
    return arr;
  });

  return { resolv, daemonData };
}

async function app() {
  const { resolv, daemonData } = await dataReadAndCreate();

  const daemon = Object.fromEntries(daemonData);

  await new Promise((resolve, reject) => {
    fs.writeFile(
      "/etc/docker/daemon.json",
      JSON.stringify(daemon, null, 2),
      (err) => {
        if (err) {
          console.log(err);
          reject(err);
          return;
        }
        console.log(
          "Docker Daemon JSON successfully written, please restart your Docker Daemon to take effect"
        );
        resolve("success");
      }
    );
  });

  return { resolv, daemon };
}

module.exports = app;
