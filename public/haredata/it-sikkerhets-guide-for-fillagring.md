Her hos Påske Drift Inc skal all konfidensiell data krypteres hvis det lagres på disk over lenger tid.

Alle filer skal bli kryptert med AES-256-CBC eller sterkere. Vi bruker OpenSSL som standard og skal være forhåndsinstalleret på alle flåtestyrte datamaskiner.

For å kryptere en fil bruk følgende kommando:
```bash
openssl aes-256-cbc -in original.fil -out original.fil.kryptert
```
Du vil å bli spurt om passord, e.g. `PåskeDrift Passord!`

**NB!!!: Viktig at du bruker et annet, unikt passord for fil lagring!**

For dekryptering, kjør tilsvarende kommando:
```bash
openssl aes-256-cbc -in original.fil.kryptert -out original.fil -d
```
Skriv så det samme passordet du brukte for å kryptere filen.

- Revidert 10. april 2020
- Påske Drift sikkerhetsavdeling
