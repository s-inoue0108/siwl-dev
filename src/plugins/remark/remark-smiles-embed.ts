import type { Root } from "mdast";
import { visit } from "unist-util-visit";
import initRDKitModule from "@rdkit/rdkit";

export default function remarkSmilesEmbed() {
  return async (tree: Root) => {
    const transformer: any[] = [];
    visit(tree, "paragraph", (node) => {
      if (node.children.length !== 1) return;
      const paragraphNode = node.children[0];
      if (!paragraphNode) return;

      visit(paragraphNode, 'text', (textNode) => {
        if (!/^\@\{(?:smi|smiles|chem)\}\(.+\)$/.test(textNode.value)) return;

        const strMatch = textNode.value.match(/^\@\{(?:smi|smiles|chem)\}\((.+)\)$/);
        if (!strMatch) return;

        const smiles = strMatch[1];

        transformer.push(async () => {
          const embed = await buildChemicalStructure(smiles);
          const iframeNode = {
            type: "html",
            value: embed,
          }

          node.children.splice(0, 1, iframeNode as { type: "text", value: string });
        });
      });
    });

    try {
      await Promise.all(transformer.map((t) => t()));
    } catch (error) {
      console.error(`[remark-smiles-embed] Error: ${error}`);
    }
  }
}

const buildChemicalStructure = async (smiles: string): Promise<string> => {
  const rdkit = await initRDKitModule();
  const mol = rdkit.get_mol(smiles);

  let svg = mol.get_svg();

  const scale = 1.8

  // fix width, height
  svg = svg.replace(
    /(width|height)='(\d+(?:\.\d+)?)px'/g,
    (_, attr, value) => `${attr}='${Number(value) * scale}px'`
  );

  // remove bg color
  svg = svg.replace(
    /(style=['"][^'"]*\bfill\s*:\s*)#([0-9a-fA-F]{6})/g,
    "$1none"
  );

  const color = "#a1a1aa"

  // replace bond color
  svg = svg.replace(
    /(style=['"][^'"]*\bstroke\s*:\s*)#([0-9a-fA-F]{6})/g,
    `$1${color}`
  );

  // replace atom color
  svg = svg.replace(
    /(<path\b[^>]*class=['"]atom-[^'"]+['"][^>]*\bfill\s*=\s*['"])#[0-9a-fA-F]{6}(['"][^>]*>)/g,
    `$1${color}$2`
  );

  mol.delete();
  return "<div class='w-fit mx-auto'>" + svg + "</div>";
}