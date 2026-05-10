import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, ChevronRight, BookOpen } from 'lucide-react';
import { STAGES_BY_STATUS } from '@/data/parcels/types';
import { Drawer as DrawerPrimitive } from 'vaul';

const HELP_TABS = [
  { id: 'overview',  label: 'Overview' },
  { id: 'statuses',  label: 'Statuses' },
  { id: 'stages',    label: 'Stages' },
  { id: 'onhold',    label: 'On Hold' },
] as const;

type HelpTab = typeof HELP_TABS[number]['id'];

// ─── Detailed status data ────────────────────────────────────────────────────
const STATUS_DETAILS = [
  {
    name: 'Delinquent',
    color: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20',
    dot: 'bg-red-500',
    description:
      'A parcel enters Delinquent status when property taxes remain unpaid past their statutory due date. This is the opening chapter of the enforcement workflow. No legal action has been taken yet, but the clock is ticking. The county begins issuing formal notices and tracking critical deadlines.',
    triggers: 'Taxes are not paid by the installment due date specified by state law.',
    keyActions: [
      'Register the case and create the delinquency record',
      'Send the Early Notice letter to the property owner',
      'Send the Final Notice (certified mail) if no response',
      'Track the Letter Report expiration date',
      'Monitor the 90-Day Expiration Window before escalation',
      'Conduct a Pre-Enforcement Review before advancing',
    ],
    exits: 'Owner pays in full → Complete. Owner enters an arrangement → Payment Plan. No response after 90-day window → Early Enforcement.',
  },
  {
    name: 'Payment Plan',
    color: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20',
    dot: 'bg-blue-500',
    description:
      'A Payment Plan status indicates the property owner has entered into a formal written agreement with the county to pay their delinquent taxes in installments over an agreed period. While the plan is active and in compliance, all enforcement actions are suspended.',
    triggers: 'Owner contacts the county, an agreement is negotiated, and the Payment Plan letter is sent and signed.',
    keyActions: [
      'Draft and send the Payment Plan agreement letter',
      'Confirm the letter is signed and returned',
      'Monitor each scheduled payment for timely receipt',
      'Flag any missed payments immediately — default may revoke the plan',
    ],
    exits: 'All payments received on schedule → Complete (Paid in Full). Owner misses payment → returns to Delinquent or escalates to Early Enforcement.',
  },
  {
    name: 'Early Enforcement',
    color: 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20',
    dot: 'bg-orange-500',
    description:
      'Early Enforcement is the first formal legal phase. The county begins assembling the legal record needed to pursue a Tax Deed. This requires identifying every party with a legal interest in the property and formally notifying them. Mistakes at this stage can invalidate the entire proceeding.',
    triggers: 'The 90-Day Expiration Window has passed with no payment or arrangement, and Pre-Enforcement Review has cleared the case.',
    keyActions: [
      'Conduct a title search to identify all owners, lienholders, and interested parties',
      'File the Notice of Tax Deed Application with the county clerk',
      'Prepare and sign the Letter of Affidavit for the legal record',
      'Review and confirm the legal description of the property',
      'Notify the property owner and any known occupants via certified mail',
      'Notify all utility companies serving the property',
    ],
    exits: 'All legally required notifications and documentation are complete → Tax Deed Preparation.',
  },
  {
    name: 'Tax Deed Preparation',
    color: 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/20',
    dot: 'bg-yellow-500',
    description:
      'During Tax Deed Preparation, county staff create and route all the legal documents required to authorize the transfer of property ownership. This is one of the most document-intensive phases and requires sign-off from multiple departments — the Treasurer and the Finance Committee must both approve the case before it can advance.',
    triggers: 'All Early Enforcement notifications are complete and the statutory waiting period has elapsed.',
    keyActions: [
      'Draft the Tax Deed document',
      'Create and finalize the Tax Deed Verify & Taxes Form (confirms all amounts)',
      'Draft the County Clerk Memo',
      'Submit the complete package to the County Clerk',
      'Submit documentation to Planning & Development (P&D)',
      'Obtain Treasurer review and sign-off',
      'Present to the Finance Committee for final governmental approval',
    ],
    exits: 'All documents approved by Treasurer and Finance Committee → Advertisement / Waiting.',
  },
  {
    name: 'Advertisement / Waiting',
    color: 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/20',
    dot: 'bg-purple-500',
    description:
      'State law requires a Tax Deed sale to be publicly advertised before it can occur — giving the community, potential buyers, and any remaining interested parties fair notice. The county publishes a legal advertisement and then waits the mandatory period (typically 4–6 weeks) before the auction can be held.',
    triggers: 'All Tax Deed preparation documents have been accepted and approved.',
    keyActions: [
      'Publish the legal advertisement in a local newspaper of general circulation',
      'Run the advertisement for the legally required number of insertions',
      'Track the mandatory post-publication waiting period',
      'Field any inquiries from potential buyers or the prior owner',
    ],
    exits: 'Advertisement wait period expires with no halt → Auction / Sale.',
  },
  {
    name: 'Auction / Sale',
    color: 'border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/20',
    dot: 'bg-indigo-500',
    description:
      'The property is now actively offered for sale to the public. The auction may be conducted in person, online, or by sealed bid. If no buyer is found at the primary auction, the property may be offered as an Over the Counter (OTC) purchase at the minimum bid price.',
    triggers: 'The mandatory advertisement wait period has expired.',
    keyActions: [
      'List the property in the auction system (live, online, or sealed bid)',
      'Accept and record all bids from registered bidders',
      'Identify the winning bidder and collect payment',
      'Finalize and execute the sale documents',
      'Process OTC sales for any properties that did not sell at auction',
    ],
    exits: 'A buyer is found and sale is finalized → Post-Deed Processing. County retains property (no buyer) → Post-Deed Processing via County Tax Deed.',
  },
  {
    name: 'Post-Deed Processing',
    color: 'border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/20',
    dot: 'bg-teal-500',
    description:
      'Once a sale occurs, the legal transfer of title must be completed and recorded. This phase handles the physical and legal handover of the property — including recording the deed, addressing any occupancy issues, and resolving any remaining title complications.',
    triggers: 'The property has been sold at auction or acquired as a County Tax Deed.',
    keyActions: [
      'Complete the Tax Deed and record it with the County Recorder',
      'Process a County Tax Deed if the county retains the property',
      'Initiate Eviction Proceedings if the prior owner or tenants refuse to vacate',
      'Issue a Quit Claim deed if needed to clear title defects',
    ],
    exits: 'Deed recorded, property vacated, and all title issues resolved → Financial Processing.',
  },
  {
    name: 'Financial Processing',
    color: 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20',
    dot: 'bg-emerald-500',
    description:
      'Financial Processing handles all accounting and disbursement of funds from the tax deed sale. If the sale generated proceeds above the delinquent tax amount owed, the prior owner is legally entitled to those surplus funds. All transactions must be formally entered into the county accounting system.',
    triggers: 'Post-Deed Processing is complete and sale proceeds have been received.',
    keyActions: [
      'Record the Finance Journal Entry in the county accounting system',
      'Issue the Proceeds Notice to the prior property owner (if surplus exists)',
      'Wait for and verify the returned Proceeds Affidavit',
      'Issue the Proceeds Check to the entitled party',
    ],
    exits: 'All financial transactions complete → Complete (Move to Treasurer).',
  },
  {
    name: 'On Hold',
    color: 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20',
    dot: 'bg-amber-500',
    description:
      "On Hold is a special status that immediately suspends all workflow progression for a parcel. It preserves the case's current stage and status — when the hold is cleared, the case resumes exactly where it left off. Holds are triggered by legal, financial, or administrative situations outside the county's immediate control.",
    triggers: 'A hold-triggering event occurs: bankruptcy filing, court order, pending appeal, probate, internal review, or a hardship request.',
    keyActions: [
      'Record the specific hold reason and date',
      'Assign a staff member to monitor the hold condition',
      'Do not advance the case while the hold is active',
      'Obtain supervisor or legal sign-off before clearing the hold',
    ],
    exits: 'The hold condition is formally resolved and a supervisor authorizes the hold to be cleared → Case resumes at prior stage.',
  },
  {
    name: 'Complete',
    color: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20',
    dot: 'bg-green-500',
    description:
      'Complete is the terminal status — the case has been fully resolved. Either all delinquent taxes were paid by the owner, or the property was sold and all legal, deed, and financial steps have been concluded. No further workflow action is needed.',
    triggers: 'Either (a) full tax payment received from the owner, or (b) all sale and financial processing steps are complete.',
    keyActions: [
      'Mark the case as Paid in Full (if owner paid directly)',
      'Move the completed case file to Treasurer records for long-term archival',
    ],
    exits: 'Terminal status — this is the end of the workflow.',
  },
];

// ─── Detailed stage data ─────────────────────────────────────────────────────
const STAGE_DETAILS: Record<string, { description: string; example: string; responsible: string }> = {
  'Initial Delinquency': {
    description: 'The parcel has just entered the delinquency workflow. Taxes are past due and the system creates a case record. No legal action has been taken yet — this is purely an administrative registration of the unpaid balance and the start of the statutory clock.',
    example: "John Smith's 2024 property taxes were due March 1 but were not paid. On March 2, the system creates an Initial Delinquency record, calculates interest, and queues the case for the first notice letter.",
    responsible: 'Tax Office Staff',
  },
  'Early Notice Issued': {
    description: 'A formal early warning notice has been mailed to the property owner. This letter states the exact amount owed including current interest and penalties, and provides clear instructions on how to pay or enter a payment plan.',
    example: 'The tax office mails a "First Notice of Delinquent Taxes" to John Smith giving him 30 days to respond before a final notice is issued.',
    responsible: 'Tax Office Staff',
  },
  'Final Notice Issued': {
    description: 'A final warning notice has been sent, typically via certified mail. This is the last official communication before enforcement proceedings begin. The letter explicitly states that failure to respond will result in Tax Deed proceedings and potential loss of the property.',
    example: 'After no response to the early notice, the county sends John Smith a certified letter: "FINAL NOTICE — Failure to pay $4,200 by [date] will result in Tax Deed proceedings beginning within 90 days."',
    responsible: 'Tax Office Staff',
  },
  'Letter Rpt Expiration': {
    description: 'The county is tracking the expiration date of the formal letter report — a document generated when statutory collection letters are issued. If the report expires before the case advances, certain notices may need to be re-issued to maintain the legal timeline.',
    example: "The letter report issued 5 months ago expires next week. Staff review the case and decide whether to renew the report or immediately escalate the case.",
    responsible: 'Tax Office Staff',
  },
  '90-Day Expiration Window': {
    description: 'This is the final countdown stage. State law grants the property owner a mandatory 90-day window after the final notice before the county can initiate formal enforcement action. The exact expiration date is tracked and visible on the case.',
    example: "John Smith's final notice was delivered April 1. His 90-day window expires June 30. On July 1, the case is automatically flagged for Pre-Enforcement Review.",
    responsible: 'Tax Office Staff',
  },
  'Pre-Enforcement Review': {
    description: 'Before formally escalating to Early Enforcement, a supervisor reviews the case to confirm: all notices were properly delivered, no bankruptcy filing is active, no active payment plan exists, no holds are pending, and all statutory requirements have been met.',
    example: 'A supervisor opens the case: certified mail receipts are scanned in, no bankruptcy found, no open payment plan, 90 days have elapsed — green light granted to escalate.',
    responsible: 'Supervisor / Senior Tax Officer',
  },
  'Escalation Ready': {
    description: 'The case has cleared all pre-enforcement checks and is formally queued for hand-off to the enforcement team. The file is complete and ready for the title search and legal notice phase to begin.',
    example: 'The case is marked "Escalation Ready" and assigned to the enforcement team. The title search officer receives a task notification to begin work.',
    responsible: 'Enforcement Team Lead',
  },
  'Payment Plan Letter Sent': {
    description: 'The formal payment plan agreement letter has been drafted and mailed to the property owner for review and signature. The case waits here until the signed agreement is returned.',
    example: 'John Smith calls to inquire about a payment plan. Staff draft an agreement for $700/month over 6 months and mail it to him. The case sits at this stage until the signed copy is returned.',
    responsible: 'Tax Office Staff',
  },
  'In Payment Plan': {
    description: 'The property owner has returned a signed payment agreement and is actively making scheduled payments. Enforcement is fully suspended as long as payments arrive on time. Staff monitor the schedule and immediately flag any missed payment.',
    example: 'Month 1: $700 received ✓. Month 2: $700 received ✓. Month 3: no payment received — staff flag the case for potential plan default review.',
    responsible: 'Tax Office Staff',
  },
  'Title Search': {
    description: 'A thorough title search is conducted to identify every party with a legal interest: owners, co-owners, mortgage lenders, judgment lienholders, contractor liens, and any other recorded interests. Every identified party must receive legal notice — missing even one can invalidate the tax deed.',
    example: "The title search on 123 Main St reveals: owner John Smith, a first mortgage with First National Bank ($120,000), and a contractor's lien from ABC Roofing ($4,500). All three must be formally notified.",
    responsible: 'Title Search Officer / Legal Team',
  },
  'Notice of Tax Deed App': {
    description: 'The county files a formal Notice of Tax Deed Application — a legal document that officially initiates the tax deed process in the public record. This notice is filed with the County Clerk and served to all interested parties identified in the title search.',
    example: 'The county files the Notice with the County Clerk and serves certified copies to John Smith, First National Bank, and ABC Roofing. Each recipient has a statutory period to respond.',
    responsible: 'Legal Team',
  },
  'Letter of Affidavit': {
    description: 'A county official prepares and signs a sworn affidavit certifying that all required legal notices have been properly delivered to every required party in the manner required by law. This affidavit becomes part of the permanent legal record.',
    example: '"I, Jane Doe, County Tax Officer, hereby certify under oath that notice was sent by certified mail to all parties of interest on May 1, 2026, per the title search results."',
    responsible: 'County Officer / Legal Team',
  },
  'Legal Description Review': {
    description: 'The official legal description of the property is reviewed line-by-line for accuracy. An incorrect legal description is one of the most common grounds for a tax deed challenge and can invalidate the entire process.',
    example: 'The draft deed reads "Lot 14, Block 3, Sunset Subdivision, per Plat recorded in Plat Book 12, Page 45." GIS staff compare this to the county plat maps and confirm it is correct.',
    responsible: 'GIS / Legal Team',
  },
  'Owner/Occupant Notification': {
    description: 'All persons actually living in or occupying the property must be personally notified of the pending tax deed action. This protects the due process rights of occupants who may not be the legal owner — such as renters or family members.',
    example: 'The title search lists John Smith as owner, but a field visit reveals a tenant, Maria Garcia, living at the property. Both Smith and Garcia receive formal notification.',
    responsible: 'Tax Office Staff',
  },
  'Utility Notification': {
    description: 'Electric, gas, water, sewer, and other utility companies serving the property are formally notified of the pending tax deed action. This is a statutory requirement in most jurisdictions.',
    example: 'Staff send certified notice letters to ComEd (electric), Nicor Gas, and the City Water Dept: "Notice of pending Tax Deed Action — 123 Main St. Sale anticipated within 90 days."',
    responsible: 'Tax Office Staff',
  },
  'Prepare Tax Deed': {
    description: 'County staff draft the actual Tax Deed — the legal instrument that will transfer ownership of the property from the delinquent owner to the buyer or the county. This requires careful review of all prior documentation and the verified legal description.',
    example: "The tax deed specialist drafts Tax Deed #2026-0042 for 123 Main St, incorporating Smith's full name, the legal description, all tax years being extinguished, and the total amount.",
    responsible: 'Tax Deed Specialist',
  },
  'Create Tax Deed Verify & Taxes Form': {
    description: 'A verification form is created that itemizes every financial component: unpaid principal taxes by year, accrued interest, penalties, and all applicable fees. This form ensures the deed accurately reflects the exact total debt being addressed by the sale.',
    example: '2022 taxes: $1,400 + 2023: $1,500 + 2024: $1,300 = $4,200 principal. Plus $630 interest + $210 penalties + $150 fees = $5,190 total on the verification form.',
    responsible: 'Tax Deed Specialist',
  },
  'Finalize Tax Deed Verify & Taxes Form': {
    description: 'A supervisor reviews the completed verification form, confirms all calculations are accurate, and authorizes it with their signature. This finalized form becomes a permanent exhibit to the tax deed and cannot be altered after this point.',
    example: 'Supervisor Johnson reviews the $5,190 breakdown, cross-references it against county tax records, confirms everything matches, and signs the form.',
    responsible: 'Supervisor',
  },
  'Create County Clerk Memo': {
    description: 'A formal memorandum is drafted to accompany the deed package submitted to the County Clerk. The memo identifies all documents included, provides recording instructions, and references the case number.',
    example: '"TO: County Clerk | RE: Tax Deed Submission — 123 Main St, Parcel #123-456-789 | Enclosed: (1) Tax Deed #2026-0042, (2) Verify & Taxes Form, (3) Affidavit of Service."',
    responsible: 'Tax Deed Specialist',
  },
  'Submit to County Clerk': {
    description: "The complete deed package — deed, verification form, clerk memo, and all supporting affidavits — is formally delivered to the County Clerk's office. The Clerk assigns a recording number and begins their independent review.",
    example: 'Staff deliver the package to the County Clerk. The Clerk stamps it received, assigns Recording #2026-CR-4421, and places it in the review queue with a 5–10 business day turnaround.',
    responsible: 'Tax Office Staff',
  },
  'Submit to P&D': {
    description: 'The tax deed documentation is copied and submitted to the Planning & Development (P&D) department for parallel review. P&D may have independent interests in the property — pending code violations, demolition warrants, or zoning disputes — that must be factored in.',
    example: 'P&D responds: "Property has 2 outstanding code violation orders for structural deficiencies. The new owner will be required to remediate within 6 months of deed transfer."',
    responsible: 'Tax Office Staff',
  },
  'Treasurer Review': {
    description: 'The County Treasurer personally reviews the case to verify all financial information is accurate, the county is properly recovering the full amount owed, and the deed is legally complete.',
    example: 'Treasurer Williams reviews the file: confirms all tax years are accounted for, interest is calculated at the statutory rate, and the deed names the correct parties — then signs the approval memo.',
    responsible: 'County Treasurer',
  },
  'Finance Committee Review': {
    description: 'The case is formally presented to the Finance Committee — a body typically composed of county board members or commissioners — for final governmental authorization. The committee votes to approve the tax deed action.',
    example: 'At the monthly Finance Committee meeting, a batch of 15 tax deed cases is presented. After discussion, the committee votes 5-0 to approve all 15 cases for advertisement and sale.',
    responsible: 'Finance Committee / County Board',
  },
  'Advertise Tax Deed': {
    description: 'The county publishes a legal advertisement of the upcoming tax deed sale in a newspaper of general circulation, as required by state statute. The advertisement must run for a specified number of insertions and include the property address, parcel number, legal description, and scheduled sale date.',
    example: 'The county places a legal notice in the County Gazette for 4 consecutive Thursdays: "NOTICE OF TAX DEED SALE — 123 Main Street, Parcel #123-456-789. Offered for sale June 15, 2026 at 10:00 AM at the County Courthouse."',
    responsible: 'Tax Office Staff',
  },
  'Post Advertisement Wait Period': {
    description: 'After the advertisement has completed all required runs, state law mandates an additional waiting period before the actual sale can occur. This window allows any last-minute redemptions, court filings, or other legal actions to be processed.',
    example: 'The fourth advertisement ran May 22. State law requires a 30-day post-advertisement hold. The auction is therefore scheduled no earlier than June 21.',
    responsible: 'Tax Office Staff (monitoring)',
  },
  'Send to Auction': {
    description: "The property has been officially listed in the upcoming tax deed auction. It may be offered via in-person public auction, an online bidding platform, or sealed bids — depending on county policy. Prospective buyers must typically register in advance.",
    example: "Fourteen properties including 123 Main St (opening bid: $5,190) are posted on the county's online auction portal with a 5-business-day bidding window. Thirty-two bidders have registered.",
    responsible: 'Auction Coordinator',
  },
  'Finalize Sale': {
    description: "A winning bidder has been identified and the sale is being completed. This includes collecting full payment, executing transfer documents, updating county ownership records, and preparing the deed for recording. The prior owner's rights are extinguished at this moment.",
    example: 'Investor LLC wins with a final bid of $6,500 on 123 Main St. Payment is collected, the deed is signed and notarized, county records are updated, and the deed is sent to the County Recorder.',
    responsible: 'Auction Coordinator / Tax Deed Specialist',
  },
  'Over the Counter Sales': {
    description: 'If a property received no bids at the primary auction, it may be offered directly for over-the-counter (OTC) purchase. Any interested buyer can apply and purchase the property for the minimum bid price — typically the total delinquent taxes owed. OTC sales are first-come, first-served.',
    example: '456 Oak Ave received no auction bids. Two weeks later, a local investor walks into the county office and purchases it directly for the $3,800 minimum. The transaction is processed same-day.',
    responsible: 'Tax Office Staff',
  },
  'Complete Tax Deed': {
    description: "All final paperwork for completing the tax deed transfer is executed, signed, notarized, and recorded with the County Recorder's office. Recording the deed makes the ownership transfer official and part of the public land record.",
    example: 'The Tax Deed for 123 Main St is recorded in Deed Book 2026, Page 412 at the County Recorder. County GIS, tax rolls, and property records are all updated to reflect Investor LLC as the new owner.',
    responsible: 'Tax Deed Specialist / County Recorder',
  },
  'County Tax Deed': {
    description: "When no private buyer is found through auction or OTC, the county itself takes ownership of the property via a County Tax Deed. The county then decides the property's next disposition — it may be transferred to a land bank, listed for future sale, donated, or scheduled for demolition.",
    example: '789 Pine Rd received no bids at auction and no OTC buyer over 60 days. The county issues a County Tax Deed and transfers the property to the County Land Bank for future disposition planning.',
    responsible: 'County Land Bank / Tax Office',
  },
  'Eviction Proceedings': {
    description: 'If the prior owner or other occupants remain on the property after the deed has transferred and refuse to voluntarily vacate, the new owner or the county must file for formal eviction through the courts.',
    example: 'John Smith refuses to leave 123 Main St despite the recorded deed. Investor LLC files an eviction complaint in County Circuit Court on July 1. A hearing is scheduled for July 22.',
    responsible: 'New Owner / Legal Counsel',
  },
  'Quit Claim': {
    description: 'A Quit Claim Deed may be issued alongside or after the Tax Deed to clear any remaining title defects or competing ownership claims. It is used specifically to "clean up" title complications and prevent future challenges.',
    example: "The title shows a disputed co-ownership claim from Smith's ex-spouse. The county issues a Quit Claim Deed to extinguish that interest, allowing Investor LLC to obtain a clean, marketable title.",
    responsible: 'Legal Team / County Recorder',
  },
  'Finance Journal Entry': {
    description: "The county's finance department formally records all transactions from the tax deed sale in the official accounting system: gross proceeds received, amount applied to recover delinquent taxes, any surplus owed to the prior owner, and all fees.",
    example: 'Finance records: Sale proceeds $6,500. Applied to delinquent taxes: $5,190. Surplus owed to prior owner: $1,310. Journal entry #JE-2026-0718 posted to the General Ledger.',
    responsible: 'County Finance / Accounting',
  },
  'Proceeds Notice': {
    description: 'If the sale generated a surplus above the delinquent tax amount, the prior owner is legally entitled to those excess funds. The county formally notifies them with a Proceeds Notice letter, explaining the amount available and how to claim it within the statutory deadline.',
    example: '"Dear Mr. Smith: The tax deed sale of your former property generated $1,310 in excess proceeds after satisfying the delinquent tax balance. To claim these funds, complete and return the enclosed affidavit within 90 days."',
    responsible: 'Tax Office Staff',
  },
  'Proceeds Affidavit Returned': {
    description: "The prior owner has completed and returned the signed Proceeds Affidavit, claiming their entitlement to the surplus funds. Staff review it for completeness, verify the claimant's identity, and forward it to finance for check processing.",
    example: "John Smith returns the notarized affidavit with a copy of his driver's license. Staff verify his identity, confirm the $1,310 amount, and send the package to Accounts Payable with approval to issue payment.",
    responsible: 'Tax Office Staff / Finance',
  },
  'Proceeds Check Issued': {
    description: 'The county cuts and mails a check to the prior owner for the surplus proceeds they are entitled to. This is typically the last financial interaction between the county and the prior owner.',
    example: 'Accounts Payable cuts Check #AP-2026-3341 for $1,310 payable to "John Smith" and mails it to his forwarding address. This is his final financial connection to 123 Main St.',
    responsible: 'County Finance / Accounts Payable',
  },
  'Bankruptcy': {
    description: 'The property owner has filed for federal bankruptcy protection. Under the U.S. Bankruptcy Code, an automatic stay immediately halts ALL collection actions — including tax deed proceedings. No workflow progress is permitted until the bankruptcy court provides further direction.',
    example: 'John Smith files Chapter 13 bankruptcy on June 1. The county receives the automatic stay notice. All Tax Deed proceedings stop immediately. Legal counsel monitors the bankruptcy court docket.',
    responsible: 'Legal Team / Tax Office',
  },
  'Litigation / Legal Hold': {
    description: 'Active litigation or a court order has halted the tax deed process. This may be a lawsuit filed by the property owner challenging the legality of the proceeding, an emergency injunction from a third party, or a court-ordered hold pending resolution of a related matter.',
    example: "Smith's attorney files an emergency motion claiming the initial delinquency notice was sent to the wrong address. The court issues a Temporary Restraining Order. All tax deed proceedings pause until the court rules.",
    responsible: 'Legal Team',
  },
  'Appeal Pending': {
    description: 'The property owner or another interested party has filed an official appeal — challenging the tax assessment, the delinquency determination, or the enforcement procedure itself. The case pauses while the appeal is reviewed by the Board of Review or applicable court.',
    example: 'Smith files a formal appeal claiming his assessed value is 40% over market value. Enforcement pauses. The Board schedules a hearing 60 days out. If the appeal reduces the assessment, the tax amount and process may change.',
    responsible: 'Board of Review / Legal Team',
  },
  'Estate / Probate': {
    description: 'The property owner has died and the property is tied up in their estate, which is currently in probate court. Until an executor is legally appointed and the estate is settled, it may not be possible to properly serve notice or obtain legally binding agreements.',
    example: 'County records show John Smith passed away in February. No estate has been opened yet. A Hold is placed while staff monitor the probate court docket for the appointment of an executor.',
    responsible: 'Legal Team / Tax Office',
  },
  'Administrative Review': {
    description: 'A county administrator, supervisor, or internal department has flagged the case for internal review before allowing it to proceed. Reasons may include a potential error in the notice procedure, a complaint filed by the property owner, or an unusual circumstance requiring management review.',
    example: 'A staff member notices the certified mail receipt for Smith\'s final notice was returned "Undeliverable." A supervisor places the case on Administrative Review to determine whether re-service is required.',
    responsible: 'Administrative Staff / Supervisor',
  },
  'Hardship Review': {
    description: 'The property owner has submitted a formal hardship request, asking the county to consider exceptional personal or financial circumstances — such as serious illness, natural disaster, or sudden loss of income — before proceeding with enforcement.',
    example: 'Smith submits a hardship application with hospital bills totaling $80,000 from a 6-month hospitalization. The county board places the case on Hardship Review and ultimately grants a 12-month deferral with waived penalties.',
    responsible: 'Tax Office / County Board',
  },
  'Paid in Full': {
    description: 'The property owner has paid the entire delinquent balance — all principal taxes, accrued interest, penalties, and fees — in full. The case is resolved immediately and completely without any property transfer or sale. This is always the preferred outcome.',
    example: 'On day 87 of the 90-Day Expiration Window, John Smith arrives at the counter and pays $5,190 (the full balance including all interest and fees) by certified check. The case is immediately closed.',
    responsible: 'Tax Office Staff',
  },
  'Move to Treasurer': {
    description: 'The completed case file is formally transferred to the County Treasurer\'s records management system for permanent archival. This administrative step marks the official closure of the case within the active DTM enforcement system.',
    example: 'After the deed is recorded and the surplus check to Smith is cleared, the 123 Main St case is closed in DTM and the full file — all notices, deeds, affidavits, and financial records — is transferred to the Treasurer\'s archive.',
    responsible: 'Tax Office Staff / Treasurer',
  },
};

// ─── Component ───────────────────────────────────────────────────────────────
export function LifecycleHelpDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<HelpTab>('overview');

  return (
    <DrawerPrimitive.Root open={open} onOpenChange={(v) => { if (!v) onClose(); }} direction="right">
      <DrawerPrimitive.Portal>
        <DrawerPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <DrawerPrimitive.Content className="fixed inset-y-0 right-0 z-50 flex h-full w-[900px] flex-col bg-background border-l shadow-xl">
          <DrawerPrimitive.Title className="sr-only">Workflow Reference Guide</DrawerPrimitive.Title>
          <DrawerPrimitive.Description className="sr-only">Understanding Statuses, Stages and On Hold in DTM</DrawerPrimitive.Description>

          {/* Header */}
          <div className="flex items-center justify-between border-b px-5 py-4 shrink-0 bg-gradient-to-r from-primary/5 to-transparent">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 border border-primary/20">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-base font-semibold">Workflow Reference Guide</p>
                <p className="text-xs text-muted-foreground">Understanding Statuses, Stages &amp; On Hold in DTM</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b px-4 py-2 shrink-0">
            {HELP_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── OVERVIEW ────────────────────────────────────────────────────── */}
          {activeTab === 'overview' && (
            <div className="flex-1 overflow-y-auto p-5 space-y-6 text-sm">
              <div className="space-y-2">
                <h2 className="text-lg font-bold">Understanding the DTM Parcel Lifecycle</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The Delinquent Tax Management (DTM) system tracks each property parcel through a defined workflow — from the moment taxes go unpaid all the way through complete resolution. Every person working in this system needs to understand three core concepts:{' '}
                  <strong className="text-foreground">Status</strong>,{' '}
                  <strong className="text-foreground">Stage</strong>, and{' '}
                  <strong className="text-foreground">On Hold</strong>. Use the tabs above to explore each in detail.
                </p>
              </div>

              <div className="space-y-3">
                <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 flex items-center justify-center">
                      <span className="text-blue-700 dark:text-blue-300 text-xs font-black">S</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-foreground">Status — The Big Picture Phase</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        A <strong>Status</strong> represents the broad phase the parcel is currently in — think of it as the <em>chapter</em> of the case story. There are 10 possible statuses, from <strong>Delinquent</strong> (just started) all the way to <strong>Complete</strong> (fully resolved). The current status tells you — at a glance — where in the overall process a case stands.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/20 p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 border border-purple-200 dark:border-purple-700 flex items-center justify-center">
                      <span className="text-purple-700 dark:text-purple-300 text-xs font-black">G</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-foreground">Stage — The Specific Step</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        A <strong>Stage</strong> is the specific action or milestone happening <em>within</em> a Status — the <em>paragraph</em> within the chapter. Stages are sequential and indicate exactly what work is in progress. For example, within the <strong>Early Enforcement</strong> status, a case moves through stages like <strong>Title Search → Notice of Tax Deed App → Letter of Affidavit</strong>.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900 border border-amber-200 dark:border-amber-700 flex items-center justify-center">
                      <span className="text-amber-700 dark:text-amber-300 text-xs font-black">H</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-foreground">On Hold — Temporary Pause</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        An <strong>On Hold</strong> flag can be applied at <em>any point</em> in the workflow to pause all progress. Unlike a normal status change, On Hold preserves the case's current stage and prevents any advancement until the hold is formally cleared. Holds are caused by legal, financial, or administrative situations outside the county's immediate control.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Standard Workflow — Typical Progression</h3>
                <p className="text-xs text-muted-foreground">The path below shows how a parcel moves from initial delinquency to resolution. Cases may branch to Payment Plan, get placed On Hold, or exit early if taxes are paid.</p>
                <div className="space-y-1.5">
                  {([
                    { status: 'Delinquent', color: 'border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-950/30', note: 'Starting point — taxes unpaid' },
                    { status: 'Payment Plan', color: 'border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/30', note: 'Optional — if owner makes arrangements' },
                    { status: 'Early Enforcement', color: 'border-orange-200 dark:border-orange-700 bg-orange-50 dark:bg-orange-950/30', note: 'Legal action & notifications begin' },
                    { status: 'Tax Deed Preparation', color: 'border-yellow-200 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-950/30', note: 'Deed drafted & approved by committee' },
                    { status: 'Advertisement / Waiting', color: 'border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-950/30', note: 'Public notice — mandatory wait period' },
                    { status: 'Auction / Sale', color: 'border-indigo-200 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-950/30', note: 'Property sold at public auction' },
                    { status: 'Post-Deed Processing', color: 'border-teal-200 dark:border-teal-700 bg-teal-50 dark:bg-teal-950/30', note: 'Deed recorded, occupancy resolved' },
                    { status: 'Financial Processing', color: 'border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30', note: 'Proceeds accounting & disbursement' },
                    { status: 'Complete', color: 'border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-950/30', note: 'Case fully closed' },
                  ] as const).map((item, i, arr) => (
                    <div key={item.status} className="flex items-center gap-2">
                      <div className={`flex-1 rounded-lg border px-3 py-2 ${item.color}`}>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold whitespace-nowrap text-foreground">{item.status}</span>
                          <span className="text-[10px] text-muted-foreground text-right leading-tight">{item.note}</span>
                        </div>
                      </div>
                      {i < arr.length - 1 && (
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="rounded-lg border bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Key rule:</strong> A case can be placed <strong className="text-foreground">On Hold</strong> at any status. The Payment Plan branch can lead directly to <strong className="text-foreground">Complete</strong> if paid in full, or return to <strong className="text-foreground">Delinquent / Early Enforcement</strong> if the owner defaults. No case should skip stages — every step must be completed in order.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── STATUSES ────────────────────────────────────────────────────── */}
          {activeTab === 'statuses' && (
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-sm">
              <div className="space-y-1">
                <h2 className="text-base font-bold">Status Reference Guide</h2>
                <p className="text-xs text-muted-foreground">Each status is a major lifecycle phase. Statuses determine which stages are available and what actions can be taken on a case.</p>
              </div>
              <div className="space-y-4">
                {STATUS_DETAILS.map((s) => (
                  <div key={s.name} className={`rounded-xl border p-4 space-y-3 ${s.color}`}>
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${s.dot}`} />
                      <h3 className="text-sm font-bold">{s.name}</h3>
                    </div>
                    <p className="text-xs leading-relaxed opacity-90">{s.description}</p>
                    <div className="space-y-2 border-t border-current/10 pt-2">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider opacity-60 mb-1">Enters when</p>
                        <p className="text-xs leading-relaxed opacity-80">{s.triggers}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider opacity-60 mb-1">Key Actions</p>
                        <ul className="space-y-1">
                          {s.keyActions.map((action) => (
                            <li key={action} className="text-xs opacity-80 flex items-start gap-1.5">
                              <span className="mt-0.5 flex-shrink-0 text-current opacity-50">▸</span>
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider opacity-60 mb-1">Exits when</p>
                        <p className="text-xs leading-relaxed opacity-80">{s.exits}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── STAGES ──────────────────────────────────────────────────────── */}
          {activeTab === 'stages' && (
            <div className="flex-1 overflow-y-auto p-5 space-y-6 text-sm">
              <div className="space-y-1">
                <h2 className="text-base font-bold">Stage Reference Guide</h2>
                <p className="text-xs text-muted-foreground leading-relaxed">Stages are the specific workflow steps within each Status. Each stage includes a plain-language explanation and a real-world example to help you understand exactly what the work involves.</p>
              </div>
              {(Object.entries(STAGES_BY_STATUS) as [string, string[]][]).map(([statusName, stages]) => (
                <div key={statusName} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-background px-2">{statusName}</span>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  <div className="space-y-3 pl-1">
                    {stages.map((stageName, idx) => {
                      const detail = STAGE_DETAILS[stageName];
                      if (!detail) return null;
                      return (
                        <div key={stageName} className="border rounded-xl p-3 space-y-2.5 hover:bg-muted/20 transition-colors">
                          <div className="flex items-start gap-2.5">
                            <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-muted border flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                              {idx + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold leading-tight">{stageName}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">Responsible: {detail.responsible}</p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed pl-7">{detail.description}</p>
                          <div className="ml-7 rounded-lg bg-primary/5 border border-primary/15 p-2.5">
                            <p className="text-[10px] font-bold text-primary mb-1 uppercase tracking-wider">Example</p>
                            <p className="text-xs text-muted-foreground leading-relaxed italic">{detail.example}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── ON HOLD ─────────────────────────────────────────────────────── */}
          {activeTab === 'onhold' && (
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-sm">
              <div className="space-y-1">
                <h2 className="text-base font-bold">On Hold — Reference Guide</h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The <strong className="text-foreground">On Hold</strong> status immediately suspends all workflow progression for a parcel. It preserves the case's current stage and status — when the hold is cleared, the case resumes exactly where it left off.
                </p>
              </div>
              <div className="rounded-xl border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30 p-4 space-y-1.5">
                <p className="text-xs font-bold text-amber-900 dark:text-amber-100">Critical Note for All Staff</p>
                <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                  Only authorized staff may clear an On Hold flag. Before clearing, confirm with your supervisor or legal team that the hold reason is <em>fully and formally</em> resolved. Advancing a case that legally should remain on hold — especially during active bankruptcy or litigation — can create serious legal liability for the county.
                </p>
              </div>
              <div className="space-y-3">
                {(['Bankruptcy', 'Litigation / Legal Hold', 'Appeal Pending', 'Estate / Probate', 'Administrative Review', 'Hardship Review'] as const).map((stageName) => {
                  const detail = STAGE_DETAILS[stageName];
                  if (!detail) return null;
                  return (
                    <div key={stageName} className="rounded-xl border p-4 space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-400 flex-shrink-0" />
                        <p className="text-sm font-bold">{stageName}</p>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed pl-4">{detail.description}</p>
                      <div className="ml-4 rounded-lg bg-muted/50 border p-2.5">
                        <p className="text-[10px] font-bold text-muted-foreground mb-1 uppercase tracking-wider">Example Scenario</p>
                        <p className="text-xs text-muted-foreground leading-relaxed italic">{detail.example}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    </DrawerPrimitive.Root>
  );
}
