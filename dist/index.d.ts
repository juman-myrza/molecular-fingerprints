declare class MolecularFingerprint {
    private static BIT_VECTOR_SIZE;
    private static RADIUS;
    private static readonly ATOM_SYMBOLS;
    private static readonly BOND_TYPES;
    private static readonly BASE_PRIME;
    private static hash;
    private static getNeighbors;
    private static generateSubstructureHash;
    /**
     *
     * @param smiles
     * @param radius default value is 1024
     * @returns fingerprint
     */
    static convertToMorganFingerprint(smiles: string, radius?: number): number[];
}
