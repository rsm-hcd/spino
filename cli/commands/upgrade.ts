interface Meta {
  latest: string;
  versions: Record<string, unknown>;
}

export async function upgradeCommand() {
  const packageName = "@rsm-hcd/spino";
  const fetchResult = await fetch(`https://jsr.io/${packageName}/meta.json`);
  const meta: Meta = await fetchResult.json();

  const process = new Deno.Command(Deno.execPath(), {
    args: [
      "install",
      "-gfR",
      "--no-check",
      "--quiet",
      "--allow-net=jsr.io:443",
      '--allow-run="deno"',
      `${packageName}@${meta.latest}`,
    ],
  }).spawn();

  await process.status;

  console.log(`✅ Spino is updated to latest version: ${meta.latest}`);
}
