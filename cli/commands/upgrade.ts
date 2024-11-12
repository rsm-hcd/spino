export function upgradeCommand(source: string) {
  const command = new Deno.Command("deno", {
    args: ["install", "-gRf", "--allow-run", '--allow-run="deno"', source],
  });

  command.outputSync();
  console.log("✅ Updated spino to latest version");
}
