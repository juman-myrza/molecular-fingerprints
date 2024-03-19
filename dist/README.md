# Molecular Fingerprint

This is a TypeScript package for generating Morgan fingerprints from chemical SMILES notation.

## Overview

Morgan fingerprints are circular fingerprints that represent the structural features of a molecule. This class provides functionality to convert a given SMILES notation into Morgan fingerprints, which can be used for tasks like molecular similarity comparison, substructure searching, and machine learning in cheminformatics.

## Installation

Install molecular-fingerprint with npm

```bash
  npm install molecular-fingerprint
```

## Usage

To use this class, simply import it into your TypeScript project and call the convertToMorganFingerprint method, passing the SMILES notation of the molecule you want to generate fingerprints for.

```typescript
import { MolecularFingerprint } from 'molecular-fingerprint'

const smiles = 'C1=CC=CC=C1'
const fingerprint = MolecularFingerprint.convertToMorganFingerprint(smiles)
console.log(fingerprint)
```

Optionally, you can specify the radius parameter for the Morgan fingerprint. The default value is 2.

```typescript
const radius = 3
const fingerprint = MolecularFingerprint.convertToMorganFingerprint(smiles, radius)
console.log(fingerprint)
```

## Parameters

**SMILES**: The Simplified Molecular Input Line Entry System (SMILES) notation of the molecule.

**Radius**: The radius parameter controls the number of atoms considered in the substructure generation. Default value is 2.
