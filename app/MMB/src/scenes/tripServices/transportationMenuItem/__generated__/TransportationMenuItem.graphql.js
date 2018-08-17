/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
type TransportLocationItem$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type TransportationMenuItem$ref: FragmentReference;
export type TransportationMenuItem = {|
  +transportation: ?{|
    +relevantLocations: ?$ReadOnlyArray<?{|
      +whitelabelURL: ?string,
      +location: ?{|
        +location: ?{|
          +lat: ?number,
          +lng: ?number,
        |},
        +$fragmentRefs: TransportLocationItem$ref,
      |},
    |}>
  |},
  +$refType: TransportationMenuItem$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "TransportationMenuItem",
  "type": "WhitelabeledServices",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "transportation",
      "storageKey": null,
      "args": null,
      "concreteType": "TransportationService",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "relevantLocations",
          "storageKey": null,
          "args": null,
          "concreteType": "TransportationServiceRelevantLocations",
          "plural": true,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "whitelabelURL",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "location",
              "storageKey": null,
              "args": null,
              "concreteType": "Location",
              "plural": false,
              "selections": [
                {
                  "kind": "FragmentSpread",
                  "name": "TransportLocationItem",
                  "args": null
                },
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "location",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "Coordinates",
                  "plural": false,
                  "selections": [
                    {
                      "kind": "ScalarField",
                      "alias": null,
                      "name": "lat",
                      "args": null,
                      "storageKey": null
                    },
                    {
                      "kind": "ScalarField",
                      "alias": null,
                      "name": "lng",
                      "args": null,
                      "storageKey": null
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
// prettier-ignore
(node/*: any*/).hash = '2e45795206df04548bec5118e1af4222';
module.exports = node;
