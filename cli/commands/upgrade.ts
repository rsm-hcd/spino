interface Meta {
  latest: string;
  versions: Record<string, unknown>;
}

export async function upgradeCommand() {
  const packageName = "@rsm-hcd/spino";
  const fetchResult = await fetch(`https://jsr.io/${packageName}/meta.json`);
  const meta: Meta = await fetchResult.json();

  const command = new Deno.Command("deno", {
    args: [
      "install",
      "-gfR",
      "--allow-run",
      "--allow-net=jsr.io",
      '--allow-run="deno"',
      `${packageName}@${meta.latest}`,
    ],
  });

  command.outputSync();
  console.log(`✅ Spino is updated to version ${meta.latest}`);
}
