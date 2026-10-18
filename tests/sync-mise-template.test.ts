import { expect, test } from "bun:test";
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";

test("syncs the Forgejo CLI update into the template pin", async () => {
  const root = await mkdtemp(join(tmpdir(), "sync-mise-template-"));
  const scripts = join(root, ".github/scripts");
  const template = join(root, "template/mise.toml.jinja");
  const script = join(scripts, "sync-mise-template.ts");

  try {
    await mkdir(scripts, { recursive: true });
    await mkdir(join(root, "template"), { recursive: true });
    await cp(
      resolve(import.meta.dir, "../.github/scripts/sync-mise-template.ts"),
      script
    );
    await writeFile(join(root, "mise.toml"), "[tools]\n");
    await writeFile(
      template,
      '[tools]\n"forgejo:forgejo-contrib/forgejo-cli" = "0.7.0"\n'
    );

    const result = Bun.spawnSync(["bun", script], {
      env: {
        ...process.env,
        MISE_TEMPLATE_FORGEJO_CLI_VERSION: "0.8.0"
      }
    });

    expect(result.exitCode).toBe(0);
    expect(await readFile(template, "utf8")).toContain(
      '"forgejo:forgejo-contrib/forgejo-cli" = "0.8.0"'
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
