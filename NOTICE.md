# Licensing and Third-Party Notices

## Materials licensed under MIT

The following Boundary Notes materials are licensed under the [MIT License](LICENSE):

- The source code in this repository, unless an individual file or directory
  states a different license.
- The published question bank, including its selection and arrangement;
  categories and detail items; identifiers, names, labels, titles,
  descriptions, and warnings; Leading/Following variants; and published
  translations. The question bank is currently maintained in
  `src/features/question-bank/questionBank.ts`,
  `src/features/question-bank/detailTitles.ts`, and
  `src/features/question-bank/locales/`.

The term "Software" in `LICENSE` covers both materials listed above. The MIT
License permits use, copying, reproduction, modification, publication,
distribution, sublicensing, and sale of these materials, in whole or in part,
including adaptations, subject to its copyright and license notice requirement.

## Materials requiring separate permission

The Boundary Notes name, logos, trademarks, rabbit character and other brand
identity, category illustrations and other artwork, application copy outside
the question bank, and legal documents require separate permission for reuse
unless separately licensed. References to image filenames in the question bank
do not license the images.

Third-party materials are governed by their own licenses, listed below.

## jf open-huninn / jf open 粉圓

- Delivery: Google Fonts runtime stylesheet with WOFF2 unicode-range subsets
- Source: https://github.com/justfont/open-huninn-font
- Copyright: justfont and contributors
- License: SIL Open Font License 1.1
- License copy: `third-party-notices/jf-openhuninn-LICENSE.txt`

The application does not bundle a full font binary. Modern browsers request
only the WOFF2 subsets that match the text currently rendered, while system
CJK fallbacks preserve readability if the external font service is unavailable.
