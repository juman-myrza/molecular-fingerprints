export default class MolecularFingerprint {
  private static BIT_VECTOR_SIZE = 1024
  private static RADIUS = 2

  // prettier-ignore
  private static readonly ATOM_SYMBOLS = [
    'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar',
    'K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br',
    'Kr', 'Rb', 'Sr', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn', 'Sb', 'Te',
    'I', 'Xe', 'Cs', 'Ba', 'La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm',
    'Yb', 'Lu', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg', 'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn',
    'Fr', 'Ra', 'Ac', 'Th', 'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm', 'Md', 'No', 'Lr',
    'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds', 'Rg', 'Cn', 'Nh', 'Fl', 'Mc', 'Lv', 'Ts', 'Og'
];

  private static readonly BOND_TYPES = ['-', '=', '#', ':', '/', '\\']

  private static readonly BASE_PRIME = 67

  private static hash(s: string): number {
    let h = 0

    for (let i = 0; i < s.length; i++) {
      h = MolecularFingerprint.BASE_PRIME * h + s.charCodeAt(i)
    }

    return h
  }

  private static getNeighbors(atomIndex: number, bonds: number[][], atoms: string[], radius: number): number[] {
    const neighbors: number[] = []
    const visited: Set<number> = new Set()
    const queue: [number, number][] = [[atomIndex, 0]]

    while (queue.length > 0) {
      const [currentAtomIndex, currentRadius] = queue.shift()!
      if (currentRadius > radius) break // stop if reached the specified radius
      if (visited.has(currentAtomIndex)) continue

      visited.add(currentAtomIndex)
      if (currentRadius > 0) neighbors.push(currentAtomIndex)

      for (const bond of bonds) {
        if (bond.includes(currentAtomIndex)) {
          const neighborIndex = bond[0] === currentAtomIndex ? bond[1] : bond[0]
          queue.push([neighborIndex, currentRadius + 1])
        }
      }
    }

    return neighbors
  }

  private static generateSubstructureHash(
    atomIndex: number,
    atoms: string[],
    bonds: number[][],
    radius: number
  ): number {
    let substructure = atoms[atomIndex]
    const neighbors = MolecularFingerprint.getNeighbors(atomIndex, bonds, atoms, radius)
    neighbors.sort((a, b) => a - b) // Sort neighbors to ensure consistent hash

    for (const neighbor of neighbors) {
      const bond = bonds.find((bond) => bond.includes(atomIndex) && bond.includes(neighbor))
      if (bond) {
        const bondType = MolecularFingerprint.BOND_TYPES[bond[2]]
        substructure += bondType + atoms[neighbor]
      }
    }

    return MolecularFingerprint.hash(substructure) % MolecularFingerprint.BIT_VECTOR_SIZE
  }

  /**
   *
   * @param smiles
   * @param radius default value is 1024
   * @returns fingerprint
   */
  public static convertToMorganFingerprint(smiles: string, radius: number = MolecularFingerprint.RADIUS): number[] {
    const atoms: string[] = []
    const bonds: number[][] = []
    const atomMap: Map<string, number> = new Map()

    let currentAtomIndex = 0
    for (let i = 0; i < smiles.length; i++) {
      if (MolecularFingerprint.ATOM_SYMBOLS.includes(smiles[i])) {
        const atomSymbol = smiles[i]
        atoms.push(atomSymbol)
        atomMap.set(atomSymbol, currentAtomIndex)
        currentAtomIndex++
      } else if (MolecularFingerprint.BOND_TYPES.includes(smiles[i])) {
        const bondTypeIndex = MolecularFingerprint.BOND_TYPES.indexOf(smiles[i])
        const sourceAtomIndex = atomMap.get(atoms[currentAtomIndex - 2])
        const targetAtomIndex = atomMap.get(atoms[currentAtomIndex - 1])
        // @ts-ignore
        bonds.push([sourceAtomIndex, targetAtomIndex, bondTypeIndex])
      }
    }

    const fingerprint: number[] = Array(MolecularFingerprint.BIT_VECTOR_SIZE).fill(0)

    for (let i = 0; i < atoms.length; i++) {
      const atomHash = MolecularFingerprint.generateSubstructureHash(i, atoms, bonds, radius)
      fingerprint[atomHash] = 1
    }

    return fingerprint
  }
}
