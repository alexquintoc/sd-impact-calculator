// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="index.html">Introduction</a></span></li><li class="chapter-item expanded "><li class="part-title">Standard</li></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="standard/overview.html"><strong aria-hidden="true">1.</strong> Overview</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="standard/scoring-philosophy.html"><strong aria-hidden="true">2.</strong> Scoring Philosophy</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="standard/contributing.html"><strong aria-hidden="true">3.</strong> Contributing</a></span></li><li class="chapter-item expanded "><li class="part-title">Reference</li></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/pillars/index.html"><strong aria-hidden="true">4.</strong> Pillars</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/pillars/environment.html"><strong aria-hidden="true">4.1.</strong> Environmental Criteria</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/pillars/society.html"><strong aria-hidden="true">4.2.</strong> Social Criteria</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/pillars/culture.html"><strong aria-hidden="true">4.3.</strong> Cultural Criteria</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/pillars/finance.html"><strong aria-hidden="true">4.4.</strong> Financial Criteria</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/index.html"><strong aria-hidden="true">5.</strong> Criteria Reference</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/criteria-environment.html"><strong aria-hidden="true">5.1.</strong> Environmental Criteria</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/environment-environmental-impact-reduction-and-transparency.html"><strong aria-hidden="true">5.1.1.</strong> Environmental Impact Reduction and Transparency</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/environmental-impact-reduction.html"><strong aria-hidden="true">5.1.1.1.</strong> E1: Environmental Impact Reduction</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/product-ingredients-transparency.html"><strong aria-hidden="true">5.1.1.2.</strong> E2: Product Ingredients Transparency</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/ink-printing-and-finishes.html"><strong aria-hidden="true">5.1.1.3.</strong> E3: Ink, Printing, and Finishes</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/paper.html"><strong aria-hidden="true">5.1.1.4.</strong> E4: Paper</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/product-quantity.html"><strong aria-hidden="true">5.1.1.5.</strong> E5: Product Quantity</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/durability-extended-life.html"><strong aria-hidden="true">5.1.1.6.</strong> E6: Durability &amp; Extended Life</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/toxins.html"><strong aria-hidden="true">5.1.1.7.</strong> E7: Toxins</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/environmental-policy.html"><strong aria-hidden="true">5.1.1.8.</strong> E8: Environmental Policy</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/animal-welfare.html"><strong aria-hidden="true">5.1.1.9.</strong> EM9: Animal Welfare</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/ecosystems-conservation.html"><strong aria-hidden="true">5.1.1.10.</strong> EM10: Ecosystems Conservation</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/environment-circular-design-and-waste-reduction.html"><strong aria-hidden="true">5.1.2.</strong> Circular Design and Waste Reduction</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/recyclability-or-reusability.html"><strong aria-hidden="true">5.1.2.1.</strong> E11: Recyclability or Reusability</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/non-renewable-resources.html"><strong aria-hidden="true">5.1.2.2.</strong> E12: Non-Renewable Resources</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/biological-or-organic-materials.html"><strong aria-hidden="true">5.1.2.3.</strong> E13: Biological or Organic Materials</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/zero-waste.html"><strong aria-hidden="true">5.1.2.4.</strong> E14: Zero Waste</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/environment-energy-efficiency.html"><strong aria-hidden="true">5.1.3.</strong> Energy Efficiency</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/renewable-energy.html"><strong aria-hidden="true">5.1.3.1.</strong> E15: Renewable Energy</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/consumer-energy-efficiency.html"><strong aria-hidden="true">5.1.3.2.</strong> E16: Consumer Energy Efficiency</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/energy-efficiency.html"><strong aria-hidden="true">5.1.3.3.</strong> E17: Energy Efficiency</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/environment-emissions.html"><strong aria-hidden="true">5.1.4.</strong> Emissions</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/storage-and-transportation.html"><strong aria-hidden="true">5.1.4.1.</strong> E18: Storage and Transportation</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/quantified-ghg-reporting-and-certification.html"><strong aria-hidden="true">5.1.4.2.</strong> E19: Quantified GHG Reporting and Certification</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/air-pollution.html"><strong aria-hidden="true">5.1.4.3.</strong> E20: Air Pollution</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/carbon-offsets.html"><strong aria-hidden="true">5.1.4.4.</strong> E21: Carbon Offsets</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/environment-water.html"><strong aria-hidden="true">5.1.5.</strong> Water</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/water.html"><strong aria-hidden="true">5.1.5.1.</strong> E22: Water</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/environment-sound-light-and-smell.html"><strong aria-hidden="true">5.1.6.</strong> Sound, Light and Smell</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/sound-light-pollution.html"><strong aria-hidden="true">5.1.6.1.</strong> E23: Sound &amp; Light Pollution</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/odor-scent-and-fragrance.html"><strong aria-hidden="true">5.1.6.2.</strong> E24: Odor, Scent and Fragrance</a></span></li></ol></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/criteria-society.html"><strong aria-hidden="true">5.2.</strong> Social Criteria</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/society-design-production-and-social-impact.html"><strong aria-hidden="true">5.2.1.</strong> Design Production and Social Impact</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/harmless.html"><strong aria-hidden="true">5.2.1.1.</strong> S1: Harmless</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/health-and-safety.html"><strong aria-hidden="true">5.2.1.2.</strong> S2: Health and Safety</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/local-labour.html"><strong aria-hidden="true">5.2.1.3.</strong> S3: Local Labour</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/society-ethical-practices-in-design-and-production.html"><strong aria-hidden="true">5.2.2.</strong> Ethical Practices in Design and Production</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/human-rights.html"><strong aria-hidden="true">5.2.2.1.</strong> SM4: Human Rights</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/corruption.html"><strong aria-hidden="true">5.2.2.2.</strong> SM5: Corruption</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/rights-of-workers.html"><strong aria-hidden="true">5.2.2.3.</strong> SM6: Rights of Workers</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/artificial-intelligence-ai.html"><strong aria-hidden="true">5.2.2.4.</strong> S7: Artificial Intelligence (AI)</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/society-accessibility.html"><strong aria-hidden="true">5.2.3.</strong> Accessibility</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/electronic-documents.html"><strong aria-hidden="true">5.2.3.1.</strong> S8: Electronic Documents</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/printed-documents-and-compliance.html"><strong aria-hidden="true">5.2.3.2.</strong> S9: Printed Documents and Compliance</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/universal-design-principles.html"><strong aria-hidden="true">5.2.3.3.</strong> S10: Universal Design Principles</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/society-intellectual-property.html"><strong aria-hidden="true">5.2.4.</strong> Intellectual Property</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/intellectual-property.html"><strong aria-hidden="true">5.2.4.1.</strong> S11: Intellectual Property</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/society-social-equality.html"><strong aria-hidden="true">5.2.5.</strong> Social Equality</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/affordable.html"><strong aria-hidden="true">5.2.5.1.</strong> S12: Affordable</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/fair-trade.html"><strong aria-hidden="true">5.2.5.2.</strong> S13: Fair Trade</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/social-gaps.html"><strong aria-hidden="true">5.2.5.3.</strong> S14: Social Gaps</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/freedom-of-expression.html"><strong aria-hidden="true">5.2.5.4.</strong> S15: Freedom of Expression</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/society-education.html"><strong aria-hidden="true">5.2.6.</strong> Education</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/design-education.html"><strong aria-hidden="true">5.2.6.1.</strong> S16: Design Education</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/educational-component.html"><strong aria-hidden="true">5.2.6.2.</strong> S17: Educational Component</a></span></li></ol></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/criteria-culture.html"><strong aria-hidden="true">5.3.</strong> Cultural Criteria</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/culture-cultural-preservation-and-adaptation.html"><strong aria-hidden="true">5.3.1.</strong> Cultural Preservation and Adaptation</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/endangered-languages.html"><strong aria-hidden="true">5.3.1.1.</strong> C1: Endangered Languages</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/indigenous-culture.html"><strong aria-hidden="true">5.3.1.2.</strong> C2: Indigenous Culture</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/local-culture.html"><strong aria-hidden="true">5.3.1.3.</strong> C3: Local Culture</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/cultural-diversity.html"><strong aria-hidden="true">5.3.1.4.</strong> C4: Cultural Diversity</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/cultural-policy.html"><strong aria-hidden="true">5.3.1.5.</strong> CM5: Cultural Policy</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/culture-community-and-audience-engagement.html"><strong aria-hidden="true">5.3.2.</strong> Community and Audience Engagement</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/audience-engagement.html"><strong aria-hidden="true">5.3.2.1.</strong> C6: Audience Engagement</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/community-participation.html"><strong aria-hidden="true">5.3.2.2.</strong> C7: Community Participation</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/practitioners-education.html"><strong aria-hidden="true">5.3.2.3.</strong> C8: Practitioners&#39; Education</a></span></li></ol></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/criteria-finance.html"><strong aria-hidden="true">5.4.</strong> Financial Criteria</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/finance-basis-of-financial-sustainability.html"><strong aria-hidden="true">5.4.1.</strong> Basis of Financial Sustainability</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/economic-benefits.html"><strong aria-hidden="true">5.4.1.1.</strong> F1: Economic Benefits</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/profitability.html"><strong aria-hidden="true">5.4.1.2.</strong> F2: Profitability</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/unpaid-work.html"><strong aria-hidden="true">5.4.1.3.</strong> FM3: Unpaid Work</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/finance-economic-accountability-and-strategic-value-financial-planning.html"><strong aria-hidden="true">5.4.2.</strong> Economic Accountability and Strategic Value / Financial Planning</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/smart-goals.html"><strong aria-hidden="true">5.4.2.1.</strong> F4: SMART Goals</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/accountability-and-transparency.html"><strong aria-hidden="true">5.4.2.2.</strong> F5: Accountability and Transparency</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/standards-improvement.html"><strong aria-hidden="true">5.4.2.3.</strong> F6: Standards Improvement</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/criteria/design-thinking.html"><strong aria-hidden="true">5.4.2.4.</strong> F7: Design Thinking</a></span></li></ol></li></ol></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/terms/index.html"><strong aria-hidden="true">6.</strong> Terms Index</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/terms/carbon-footprint.html"><strong aria-hidden="true">6.1.</strong> Carbon Footprint</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/terms/circular-economy.html"><strong aria-hidden="true">6.2.</strong> Circular Economy</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/terms/emissions.html"><strong aria-hidden="true">6.3.</strong> Emissions</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/terms/lifecycle-assessment.html"><strong aria-hidden="true">6.4.</strong> Lifecycle Assessment</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/terms/print-on-demand.html"><strong aria-hidden="true">6.5.</strong> Print on Demand</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/terms/sustainability.html"><strong aria-hidden="true">6.6.</strong> Sustainability</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/terms/sustainable-materials.html"><strong aria-hidden="true">6.7.</strong> Sustainable Materials</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="generated/terms/waste-reduction.html"><strong aria-hidden="true">6.8.</strong> Waste Reduction</a></span></li></ol></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split('#')[0].split('?')[0];
        if (current_page.endsWith('/')) {
            current_page += 'index.html';
        }
        const links = Array.prototype.slice.call(this.querySelectorAll('a'));
        const l = links.length;
        for (let i = 0; i < l; ++i) {
            const link = links[i];
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#') && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The 'index' page is supposed to alias the first chapter in the book.
            if (link.href === current_page
                || i === 0
                && path_to_root === ''
                && current_page.endsWith('/index.html')) {
                link.classList.add('active');
                let parent = link.parentElement;
                while (parent) {
                    if (parent.tagName === 'LI' && parent.classList.contains('chapter-item')) {
                        parent.classList.add('expanded');
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', e => {
            if (e.target.tagName === 'A') {
                const clientRect = e.target.getBoundingClientRect();
                const sidebarRect = this.getBoundingClientRect();
                sessionStorage.setItem('sidebar-scroll-offset', clientRect.top - sidebarRect.top);
            }
        }, { passive: true });
        const sidebarScrollOffset = sessionStorage.getItem('sidebar-scroll-offset');
        sessionStorage.removeItem('sidebar-scroll-offset');
        if (sidebarScrollOffset !== null) {
            // preserve sidebar scroll position when navigating via links within sidebar
            const activeSection = this.querySelector('.active');
            if (activeSection) {
                const clientRect = activeSection.getBoundingClientRect();
                const sidebarRect = this.getBoundingClientRect();
                const currentOffset = clientRect.top - sidebarRect.top;
                this.scrollTop += currentOffset - parseFloat(sidebarScrollOffset);
            }
        } else {
            // scroll sidebar to current active section when navigating via
            // 'next/previous chapter' buttons
            const activeSection = document.querySelector('#mdbook-sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        const sidebarAnchorToggles = document.querySelectorAll('.chapter-fold-toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(el => {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define('mdbook-sidebar-scrollbox', MDBookSidebarScrollbox);


// ---------------------------------------------------------------------------
// Support for dynamically adding headers to the sidebar.

(function() {
    // This is used to detect which direction the page has scrolled since the
    // last scroll event.
    let lastKnownScrollPosition = 0;
    // This is the threshold in px from the top of the screen where it will
    // consider a header the "current" header when scrolling down.
    const defaultDownThreshold = 150;
    // Same as defaultDownThreshold, except when scrolling up.
    const defaultUpThreshold = 300;
    // The threshold is a virtual horizontal line on the screen where it
    // considers the "current" header to be above the line. The threshold is
    // modified dynamically to handle headers that are near the bottom of the
    // screen, and to slightly offset the behavior when scrolling up vs down.
    let threshold = defaultDownThreshold;
    // This is used to disable updates while scrolling. This is needed when
    // clicking the header in the sidebar, which triggers a scroll event. It
    // is somewhat finicky to detect when the scroll has finished, so this
    // uses a relatively dumb system of disabling scroll updates for a short
    // time after the click.
    let disableScroll = false;
    // Array of header elements on the page.
    let headers;
    // Array of li elements that are initially collapsed headers in the sidebar.
    // I'm not sure why eslint seems to have a false positive here.
    // eslint-disable-next-line prefer-const
    let headerToggles = [];
    // This is a debugging tool for the threshold which you can enable in the console.
    let thresholdDebug = false;

    // Updates the threshold based on the scroll position.
    function updateThreshold() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // The number of pixels below the viewport, at most documentHeight.
        // This is used to push the threshold down to the bottom of the page
        // as the user scrolls towards the bottom.
        const pixelsBelow = Math.max(0, documentHeight - (scrollTop + windowHeight));
        // The number of pixels above the viewport, at least defaultDownThreshold.
        // Similar to pixelsBelow, this is used to push the threshold back towards
        // the top when reaching the top of the page.
        const pixelsAbove = Math.max(0, defaultDownThreshold - scrollTop);
        // How much the threshold should be offset once it gets close to the
        // bottom of the page.
        const bottomAdd = Math.max(0, windowHeight - pixelsBelow - defaultDownThreshold);
        let adjustedBottomAdd = bottomAdd;

        // Adjusts bottomAdd for a small document. The calculation above
        // assumes the document is at least twice the windowheight in size. If
        // it is less than that, then bottomAdd needs to be shrunk
        // proportional to the difference in size.
        if (documentHeight < windowHeight * 2) {
            const maxPixelsBelow = documentHeight - windowHeight;
            const t = 1 - pixelsBelow / Math.max(1, maxPixelsBelow);
            const clamp = Math.max(0, Math.min(1, t));
            adjustedBottomAdd *= clamp;
        }

        let scrollingDown = true;
        if (scrollTop < lastKnownScrollPosition) {
            scrollingDown = false;
        }

        if (scrollingDown) {
            // When scrolling down, move the threshold up towards the default
            // downwards threshold position. If near the bottom of the page,
            // adjustedBottomAdd will offset the threshold towards the bottom
            // of the page.
            const amountScrolledDown = scrollTop - lastKnownScrollPosition;
            const adjustedDefault = defaultDownThreshold + adjustedBottomAdd;
            threshold = Math.max(adjustedDefault, threshold - amountScrolledDown);
        } else {
            // When scrolling up, move the threshold down towards the default
            // upwards threshold position. If near the bottom of the page,
            // quickly transition the threshold back up where it normally
            // belongs.
            const amountScrolledUp = lastKnownScrollPosition - scrollTop;
            const adjustedDefault = defaultUpThreshold - pixelsAbove
                + Math.max(0, adjustedBottomAdd - defaultDownThreshold);
            threshold = Math.min(adjustedDefault, threshold + amountScrolledUp);
        }

        if (documentHeight <= windowHeight) {
            threshold = 0;
        }

        if (thresholdDebug) {
            const id = 'mdbook-threshold-debug-data';
            let data = document.getElementById(id);
            if (data === null) {
                data = document.createElement('div');
                data.id = id;
                data.style.cssText = `
                    position: fixed;
                    top: 50px;
                    right: 10px;
                    background-color: 0xeeeeee;
                    z-index: 9999;
                    pointer-events: none;
                `;
                document.body.appendChild(data);
            }
            data.innerHTML = `
                <table>
                  <tr><td>documentHeight</td><td>${documentHeight.toFixed(1)}</td></tr>
                  <tr><td>windowHeight</td><td>${windowHeight.toFixed(1)}</td></tr>
                  <tr><td>scrollTop</td><td>${scrollTop.toFixed(1)}</td></tr>
                  <tr><td>pixelsAbove</td><td>${pixelsAbove.toFixed(1)}</td></tr>
                  <tr><td>pixelsBelow</td><td>${pixelsBelow.toFixed(1)}</td></tr>
                  <tr><td>bottomAdd</td><td>${bottomAdd.toFixed(1)}</td></tr>
                  <tr><td>adjustedBottomAdd</td><td>${adjustedBottomAdd.toFixed(1)}</td></tr>
                  <tr><td>scrollingDown</td><td>${scrollingDown}</td></tr>
                  <tr><td>threshold</td><td>${threshold.toFixed(1)}</td></tr>
                </table>
            `;
            drawDebugLine();
        }

        lastKnownScrollPosition = scrollTop;
    }

    function drawDebugLine() {
        if (!document.body) {
            return;
        }
        const id = 'mdbook-threshold-debug-line';
        const existingLine = document.getElementById(id);
        if (existingLine) {
            existingLine.remove();
        }
        const line = document.createElement('div');
        line.id = id;
        line.style.cssText = `
            position: fixed;
            top: ${threshold}px;
            left: 0;
            width: 100vw;
            height: 2px;
            background-color: red;
            z-index: 9999;
            pointer-events: none;
        `;
        document.body.appendChild(line);
    }

    function mdbookEnableThresholdDebug() {
        thresholdDebug = true;
        updateThreshold();
        drawDebugLine();
    }

    window.mdbookEnableThresholdDebug = mdbookEnableThresholdDebug;

    // Updates which headers in the sidebar should be expanded. If the current
    // header is inside a collapsed group, then it, and all its parents should
    // be expanded.
    function updateHeaderExpanded(currentA) {
        // Add expanded to all header-item li ancestors.
        let current = currentA.parentElement;
        while (current) {
            if (current.tagName === 'LI' && current.classList.contains('header-item')) {
                current.classList.add('expanded');
            }
            current = current.parentElement;
        }
    }

    // Updates which header is marked as the "current" header in the sidebar.
    // This is done with a virtual Y threshold, where headers at or below
    // that line will be considered the current one.
    function updateCurrentHeader() {
        if (!headers || !headers.length) {
            return;
        }

        // Reset the classes, which will be rebuilt below.
        const els = document.getElementsByClassName('current-header');
        for (const el of els) {
            el.classList.remove('current-header');
        }
        for (const toggle of headerToggles) {
            toggle.classList.remove('expanded');
        }

        // Find the last header that is above the threshold.
        let lastHeader = null;
        for (const header of headers) {
            const rect = header.getBoundingClientRect();
            if (rect.top <= threshold) {
                lastHeader = header;
            } else {
                break;
            }
        }
        if (lastHeader === null) {
            lastHeader = headers[0];
            const rect = lastHeader.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            if (rect.top >= windowHeight) {
                return;
            }
        }

        // Get the anchor in the summary.
        const href = '#' + lastHeader.id;
        const a = [...document.querySelectorAll('.header-in-summary')]
            .find(element => element.getAttribute('href') === href);
        if (!a) {
            return;
        }

        a.classList.add('current-header');

        updateHeaderExpanded(a);
    }

    // Updates which header is "current" based on the threshold line.
    function reloadCurrentHeader() {
        if (disableScroll) {
            return;
        }
        updateThreshold();
        updateCurrentHeader();
    }


    // When clicking on a header in the sidebar, this adjusts the threshold so
    // that it is located next to the header. This is so that header becomes
    // "current".
    function headerThresholdClick(event) {
        // See disableScroll description why this is done.
        disableScroll = true;
        setTimeout(() => {
            disableScroll = false;
        }, 100);
        // requestAnimationFrame is used to delay the update of the "current"
        // header until after the scroll is done, and the header is in the new
        // position.
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                // Closest is needed because if it has child elements like <code>.
                const a = event.target.closest('a');
                const href = a.getAttribute('href');
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    threshold = targetElement.getBoundingClientRect().bottom;
                    updateCurrentHeader();
                }
            });
        });
    }

    // Takes the nodes from the given head and copies them over to the
    // destination, along with some filtering.
    function filterHeader(source, dest) {
        const clone = source.cloneNode(true);
        clone.querySelectorAll('mark').forEach(mark => {
            mark.replaceWith(...mark.childNodes);
        });
        dest.append(...clone.childNodes);
    }

    // Scans page for headers and adds them to the sidebar.
    document.addEventListener('DOMContentLoaded', function() {
        const activeSection = document.querySelector('#mdbook-sidebar .active');
        if (activeSection === null) {
            return;
        }

        const main = document.getElementsByTagName('main')[0];
        headers = Array.from(main.querySelectorAll('h2, h3, h4, h5, h6'))
            .filter(h => h.id !== '' && h.children.length && h.children[0].tagName === 'A');

        if (headers.length === 0) {
            return;
        }

        // Build a tree of headers in the sidebar.

        const stack = [];

        const firstLevel = parseInt(headers[0].tagName.charAt(1));
        for (let i = 1; i < firstLevel; i++) {
            const ol = document.createElement('ol');
            ol.classList.add('section');
            if (stack.length > 0) {
                stack[stack.length - 1].ol.appendChild(ol);
            }
            stack.push({level: i + 1, ol: ol});
        }

        // The level where it will start folding deeply nested headers.
        const foldLevel = 3;

        for (let i = 0; i < headers.length; i++) {
            const header = headers[i];
            const level = parseInt(header.tagName.charAt(1));

            const currentLevel = stack[stack.length - 1].level;
            if (level > currentLevel) {
                // Begin nesting to this level.
                for (let nextLevel = currentLevel + 1; nextLevel <= level; nextLevel++) {
                    const ol = document.createElement('ol');
                    ol.classList.add('section');
                    const last = stack[stack.length - 1];
                    const lastChild = last.ol.lastChild;
                    // Handle the case where jumping more than one nesting
                    // level, which doesn't have a list item to place this new
                    // list inside of.
                    if (lastChild) {
                        lastChild.appendChild(ol);
                    } else {
                        last.ol.appendChild(ol);
                    }
                    stack.push({level: nextLevel, ol: ol});
                }
            } else if (level < currentLevel) {
                while (stack.length > 1 && stack[stack.length - 1].level > level) {
                    stack.pop();
                }
            }

            const li = document.createElement('li');
            li.classList.add('header-item');
            li.classList.add('expanded');
            if (level < foldLevel) {
                li.classList.add('expanded');
            }
            const span = document.createElement('span');
            span.classList.add('chapter-link-wrapper');
            const a = document.createElement('a');
            span.appendChild(a);
            a.href = '#' + header.id;
            a.classList.add('header-in-summary');
            filterHeader(header.children[0], a);
            a.addEventListener('click', headerThresholdClick);
            const nextHeader = headers[i + 1];
            if (nextHeader !== undefined) {
                const nextLevel = parseInt(nextHeader.tagName.charAt(1));
                if (nextLevel > level && level >= foldLevel) {
                    const toggle = document.createElement('a');
                    toggle.classList.add('chapter-fold-toggle');
                    toggle.classList.add('header-toggle');
                    toggle.addEventListener('click', () => {
                        li.classList.toggle('expanded');
                    });
                    const toggleDiv = document.createElement('div');
                    toggleDiv.textContent = '❱';
                    toggle.appendChild(toggleDiv);
                    span.appendChild(toggle);
                    headerToggles.push(li);
                }
            }
            li.appendChild(span);

            const currentParent = stack[stack.length - 1];
            currentParent.ol.appendChild(li);
        }

        const onThisPage = document.createElement('div');
        onThisPage.classList.add('on-this-page');
        onThisPage.append(stack[0].ol);
        const activeItemSpan = activeSection.parentElement;
        activeItemSpan.after(onThisPage);
    });

    document.addEventListener('DOMContentLoaded', reloadCurrentHeader);
    document.addEventListener('scroll', reloadCurrentHeader, { passive: true });
})();

