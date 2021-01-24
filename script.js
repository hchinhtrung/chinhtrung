    function changeAtiveTab(event, tabID) {
        let element = event.target;
        while (element.nodeName !== "A") {
            element = element.parentNode;
        }
        ulElement = element.parentNode.parentNode;
        aElements = ulElement.querySelectorAll("li > a");
        tabContents = document.getElementById("tabs-id").querySelectorAll(".tab-content > div");
        for (let i = 0; i < aElements.length; i++) {
            aElements[i].classList.remove("text-white");
            aElements[i].classList.remove("bg-blue-600");
            aElements[i].classList.add("text-blue-600");
            aElements[i].classList.add("bg-white");
            tabContents[i].classList.add("hidden");
            tabContents[i].classList.remove("block");
        }
        element.classList.remove("text-blue-600");
        element.classList.remove("bg-white");
        element.classList.add("text-white");
        element.classList.add("bg-blue-600");
        document.getElementById(tabID).classList.remove("hidden");
        document.getElementById(tabID).classList.add("block");
    }

    // unused
    /**
     * @license Copyright 2017 The Lighthouse Authors. All Rights Reserved.
     * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
     * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
     */
    'use strict';

    import ByteEfficiencyAudit, { SCORING_MODES, DEFAULT_PASS } from './byte-efficiency-audit.js';
    import { request } from '../../computed/unused-css.js';
    import { createMessageInstanceIdFn, UIStrings as __UIStrings } from '../../lib/i18n/i18n.js';

    const UIStrings = {
        /** Imperative title of a Lighthouse audit that tells the user to remove content from their CSS that isn’t needed immediately and instead load that content at a later time. This is displayed in a list of audit titles that Lighthouse generates. */
        title: 'Remove unused CSS',
        /** Description of a Lighthouse audit that tells the user *why* they should defer loading any content in CSS that isn’t needed at page load. This is displayed after a user expands the section to see more. No word length limits. 'Learn More' becomes link text to additional documentation. */
        description: 'Remove dead rules from stylesheets and defer the loading of CSS not used for ' +
            'above-the-fold content to reduce unnecessary bytes consumed by network activity. ' +
            '[Learn more](https://web.dev/unused-css-rules/).',
    };

    const str_ = createMessageInstanceIdFn(__filename, UIStrings);

    // Allow 10KiB of unused CSS to permit `:hover` and other styles not used on a non-interactive load.
    // @see https://github.com/GoogleChrome/lighthouse/issues/9353 for more discussion.
    const IGNORE_THRESHOLD_IN_BYTES = 10 * 1024;

    class UnusedCSSRules extends ByteEfficiencyAudit {
        /**
         * @return {LH.Audit.Meta}
         */
        static get meta() {
            return {
                id: 'unused-css-rules',
                title: str_(UIStrings.title),
                description: str_(UIStrings.description),
                scoreDisplayMode: SCORING_MODES.NUMERIC,
                requiredArtifacts: ['CSSUsage', 'URL', 'devtoolsLogs', 'traces'],
            };
        }

        /**
         * @param {LH.Artifacts} artifacts
         * @param {LH.Artifacts.NetworkRequest[]} _
         * @param {LH.Audit.Context} context
         * @return {Promise<ByteEfficiencyAudit.ByteEfficiencyProduct>}
         */
        static async audit_(artifacts, _, context) {
            const unusedCssItems = await request({
                CSSUsage: artifacts.CSSUsage,
                URL: artifacts.URL,
                devtoolsLog: artifacts.devtoolsLogs[DEFAULT_PASS],
            }, context);
            const items = unusedCssItems
                .filter(sheet => sheet && sheet.wastedBytes > IGNORE_THRESHOLD_IN_BYTES);

            /** @type {LH.Audit.Details.Opportunity['headings']} */
            const headings = [{
                    key: 'url',
                    valueType: 'url',
                    label: str_(__UIStrings.columnURL)
                },
                {
                    key: 'totalBytes',
                    valueType: 'bytes',
                    label: str_(__UIStrings.columnTransferSize)
                },
                {
                    key: 'wastedBytes',
                    valueType: 'bytes',
                    label: str_(__UIStrings.columnWastedBytes)
                },
            ];

            return {
                items,
                headings,
            };
        }
    }

    export default UnusedCSSRules;
    const _UIStrings = UIStrings;
export { _UIStrings as UIStrings };