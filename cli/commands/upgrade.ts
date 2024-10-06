export function upgradeCommand(source: string) {
  const command = new Deno.Command("deno", {
    args: ["cache", "--reload", source],
  });

  command.outputSync();
  console.log("Update spino to latest version");
}
