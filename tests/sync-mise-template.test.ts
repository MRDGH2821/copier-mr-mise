import { expect, test } from "bun:test";
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";

test("syncs CI-specific CLI versions into the template pins", async () => {
  const root = await mkdtemp(join(tmpdir(), "sync-mise-template-"));
  const scripts = join(root, ".github/scripts");
  const template = join(root, "template/.config/mise/config.toml.jinja");
  const script = join(scripts, "sync-mise-template.ts");

  try {
    await mkdir(scripts, { recursive: true });
    await mkdir(join(root, "template/.config/mise"), { recursive: true });
    await mkdir(join(root, ".config/mise"), { recursive: true });
    await cp(
      resolve(import.meta.dir, "../.github/scripts/sync-mise-template.ts"),
      script
    );
    await writeFile(join(root, ".config/mise/config.toml"), "[tools]\n");
    await writeFile(
      template,
      '[tools]\nglab = "1.122.0"\n"forgejo:forgejo-contrib/forgejo-cli" = "0.7.0"\n'
    );

    const result = Bun.spawnSync(["bun", script], {
      env: {
        ...process.env,
        COPIER_TEMPLATE_GLAB_VERSION: "1.123.0",
        COPIER_TEMPLATE_FORGEJO_CLI_VERSION: "0.8.0"
      }
    });

    expect(result.exitCode).toBe(0);
    const synced = await readFile(template, "utf8");
    expect(synced).toContain('glab = "1.123.0"');
    expect(synced).toContain('"forgejo:forgejo-contrib/forgejo-cli" = "0.8.0"');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
