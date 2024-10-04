# Spino

Spino is a build orchestration tool specifically for use within Deno Workspaces.
It is designed to be a simple, fast, and reliable tool for managing the build
process of Deno projects.

## Usage

Spino is a command-line tool that can be installed globally using Deno.

```sh
deno install -g --allow-read --allow-run="deno" -n spino jsr:@rsm-hcd/spino
```

Once installed, you can run the `spino` command from the terminal to run any
tasks or scripts that match the provided name.

```sh
# Run a specific task
> spino dev

# Run all dev and test tasks
> spino dev test

# See help information
> spino --help
Usage: spino [task1] [task2] ...
```

Or, you can run, without installing globally, by adding to the tasks section of
your `deno.json` file.

```json
{
  "tasks": {
    "spino": "deno --allow-read --allow-run='deno' jsr:@rsm-hcd/spino",
    "test": "deno task spino test"
  }
}
```
