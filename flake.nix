{
  description = "Flake template by Gurjaka";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
  };

  outputs = {
    self,
    nixpkgs,
  }: let
    supportedSystems = ["x86_64-linux"];
    forAllSystems = f: nixpkgs.lib.genAttrs supportedSystems (system: f nixpkgs.legacyPackages.${system});

    flake_attributes = forAllSystems (pkgs: rec {
      common-system-deps = with pkgs; [
        # list of dependencies that are system related
        prettier
        live-server
      ];

      shell-env = {
        # Environmental configuration e.g expose correct library paths
      };

      pkgs-wrapped = pkgs.lib.lists.flatten [
        # Wrap packages into single list e.g system-deps, python-deps, etc...
        common-system-deps
      ];
    });
  in {
    formatter = forAllSystems (pkgs: pkgs.alejandra);

    devShells = forAllSystems (pkgs: {
      default = pkgs.mkShell {
        env = flake_attributes.${pkgs.stdenv.hostPlatform.system}.shell-env;
        packages = flake_attributes.${pkgs.stdenv.hostPlatform.system}.pkgs-wrapped;
      };
    });
  };
}
