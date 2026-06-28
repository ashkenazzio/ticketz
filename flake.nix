{
  # Dev shell for working on Ticketz on NixOS. Its sole job today is to make the
  # Prisma CLI work: Prisma can't download a prebuilt `schema-engine` binary for
  # the `linux-nixos` target (the download 404s), so we point it at the engine
  # nixpkgs already packages. Without this, `prisma migrate`/`generate` fail.
  #
  # Tracked in-repo for reproducibility across NixOS machines. It's opt-in: only
  # affects shells you enter via `nix develop` (or direnv). CI runs on Ubuntu and
  # downloads Prisma engines normally, so it is unaffected by any of this.
  #
  # Use: `nix develop` (or auto-load via direnv once `.envrc` is enabled).

  description = "Ticketz dev shell (NixOS Prisma engine wiring)";

  inputs.nixpkgs.url = "flake:nixpkgs";

  outputs = { self, nixpkgs }:
    let
      forAllSystems = nixpkgs.lib.genAttrs [ "x86_64-linux" "aarch64-linux" ];
    in
    {
      devShells = forAllSystems (system:
        let
          pkgs = import nixpkgs { inherit system; };
        in
        {
          default = pkgs.mkShell {
            packages = [ pkgs.nodejs_24 pkgs.prisma-engines ];

            # Prisma 7 only needs the schema-engine externally; the query engine
            # ships inside @prisma/client. Point the CLI at the Nix-provided one.
            PRISMA_SCHEMA_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/schema-engine";
          };
        });
    };
}
