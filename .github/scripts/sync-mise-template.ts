import { resolve } from "path";

type ToolSpec = string | { version: string };

const root = resolve(import.meta.dir, "../..");
const config = Bun.TOML.parse(
  await Bun.file(resolve(root, "mise.toml")).text()
) as {
  tools: Record<string, ToolSpec>;
};
const templatePath = resolve(root, "template/mise.toml.jinja");
const lines = (await Bun.file(templatePath).text()).split(/(?<=\n)/);

const versions = new Map<string, string>();
for (const [name, spec] of Object.entries(config.tools)) {
  const version = typeof spec === "string" ? spec : spec.version;
  if (version !== "latest") versions.set(name, version);
}
if (!versions.has("glab") && process.env.COPIER_TEMPLATE_GLAB_VERSION) {
  versions.set("glab", process.env.COPIER_TEMPLATE_GLAB_VERSION);
}
if (
  !versions.has("forgejo:forgejo-contrib/forgejo-cli") &&
  process.env.COPIER_TEMPLATE_FORGEJO_CLI_VERSION
) {
  versions.set(
    "forgejo:forgejo-contrib/forgejo-cli",
    process.env.COPIER_TEMPLATE_FORGEJO_CLI_VERSION
  );
}

for (const [name, version] of versions) {
  const key = /^[A-Za-z0-9_-]+$/.test(name) ? name : JSON.stringify(name);
  const matches = lines.flatMap((line, index) =>
    line.startsWith(`${key} = `) ? [index] : []
  );
  if (matches.length !== 1) {
    throw new Error(
      `Expected one template declaration for ${name}, found ${matches.length}`
    );
  }

  const index = matches[0];
  const pattern = lines[index].includes("{")
    ? /(version\s*=\s*)"[^"]+"/
    : /(=\s*)"[^"]+"/;
  if (!pattern.test(lines[index]))
    throw new Error(`Expected a version value for ${name}`);
  lines[index] = lines[index].replace(pattern, `$1"${version}"`);
}

await Bun.write(templatePath, lines.join(""));
