import { Section, VersionInfo } from './comparison.model';

export const VERSION_INFO: VersionInfo[] = [
  { title: 'Property Global Master Product', version: 'Version 1.0', date: '' },
  { title: 'Property Global Master Product', version: 'Version 2.0', date: 'Published 8/4/2026' }
];

const CHECK = { type: 'check' as const };
const DASH = { type: 'dash' as const };

export const SECTIONS: Section[] = [
  {
    title: 'General',
    rows: [
      {
        label: 'Product description',
        v1: {
          type: 'longtext',
          text: 'The AGCS Glocal Property Master product offers comprehensive property insurance solutions that address both global and local needs. It provides a standardized framework while allowing for customization to meet specific client requirements. Key features include core coverages that protect against a wide range of risks, such as fire, natural disasters, and other perils affecting physical assets. The product also allows for customizable extensions to tailor additional coverages to the unique exposures of different industries and geographical locations. Clients benefit from access to risk management services, including risk assessment and mitigation, to help minimize potential losses. Efficient claims support focuses on minimizing business interruption and ensuring quick recovery. By combining Allianz\'s global network and resources with local market expertise, the Glocal Property Master product delivers effective solutions for businesses seeking robust property insurance adapted to their specific operational and geographical risks. For more detailed information, please refer to the internal product documentation or contact the AGCS underwriting team.'
        },
        v2: {
          type: 'longtext',
          text: 'The AGCS Glocal Property Master product offers comprehensive property insurance solutions that address both global and local needs. It provides a standardized framework while allowing for customization to meet specific client requirements. Key features include core coverages that protect against a wide range of risks, such as fire, natural disasters, and other perils affecting physical assets. The product also allows for customizable extensions to tailor additional coverages to the unique exposures of different industries and geographical locations. Clients benefit from access to risk management services, including risk assessment and mitigation, to help minimize potential losses. For more detailed information, please refer to the internal product documentation or contact the AGCS underwriting team.',
          change: 'updated'
        }
      },
      {
        label: 'Owner',
        v1: { type: 'text', text: 'Mara Musterman' },
        v2: { type: 'text', text: 'Sarah Lee', change: 'updated' }
      },
      {
        label: 'Operational entity',
        unchanged: true,
        v1: {
          type: 'list',
          items: ['AGCS Germany', 'AGCS United States', 'AGCS China', 'AGCS Canada', 'AGCS Spain',
            'AGCS India', 'AGCS Japan', 'AGCS France', 'AGCS Brazil', 'AGCS Belgium',
            'AGCS Hong Kong', 'AGCS Denmark', 'AGCS South Africa', 'AGCS Finland',
            'AGCS New Zealand', 'AGCS Netherlands', 'AGCS Mexico', 'AGCS Sweden',
            'AGCS South Korea', 'AGCS Norway', 'AGCS Portugal', 'AGCS Italy',
            'AGCS Australia', 'AGCS Switzerland', 'AGCS Singapore']
        },
        v2: {
          type: 'list',
          items: ['AGCS Germany', 'AGCS United States', 'AGCS China', 'AGCS Canada', 'AGCS Spain',
            'AGCS India', 'AGCS Japan', 'AGCS France', 'AGCS Brazil', 'AGCS Belgium',
            'AGCS Hong Kong', 'AGCS Denmark', 'AGCS South Africa', 'AGCS Finland',
            'AGCS New Zealand', 'AGCS Netherlands', 'AGCS Mexico', 'AGCS Sweden',
            'AGCS South Korea', 'AGCS Norway', 'AGCS Portugal', 'AGCS Italy',
            'AGCS Australia', 'AGCS Switzerland', 'AGCS Singapore']
        }
      }
    ]
  },
  {
    title: 'Overall limits & deductibles',
    subgroups: [
      {
        label: 'Limits',
        rows: [
          {
            label: 'Limits type', unchanged: true,
            v1: { type: 'list', items: ['Overall limit', 'Sub-limit', 'Additional limit'] },
            v2: { type: 'list', items: ['Overall limit', 'Sub-limit', 'Additional limit'] }
          },
          {
            label: 'Amount type', unchanged: true,
            v1: { type: 'text', text: 'Absolute value' },
            v2: { type: 'text', text: 'Absolute value' }
          },
          {
            label: 'Occurrence', unchanged: true,
            v1: { type: 'list', items: ['No aggregate', 'Term aggregate'] },
            v2: { type: 'list', items: ['No aggregate', 'Term aggregate'] }
          },
          {
            label: 'Aggregate type', unchanged: true,
            v1: { type: 'list', items: ['Event / Occurrence', 'Loss / Location'] },
            v2: { type: 'list', items: ['Event / Occurrence', 'Loss / Location'] }
          },
          {
            label: 'Condition',
            v1: { type: 'text', text: '• BI Indemnity period' },
            v2: { type: 'change', change: 'removed', hasDropdown: true }
          },
          {
            label: 'Condition unit',
            v1: { type: 'text', text: '• Days' },
            v2: { type: 'change', change: 'removed', hasDropdown: true }
          }
        ]
      },
      {
        label: 'Deductibles',
        rows: [
          {
            label: 'Deductibles type', unchanged: true,
            v1: { type: 'list', items: ['Standard deductible', 'Excess', 'Franchise'] },
            v2: { type: 'list', items: ['Standard deductible', 'Excess', 'Franchise'] }
          },
          {
            label: 'Amount type', unchanged: true,
            v1: { type: 'list', items: ['Amount', '% of TSI', 'Number of days'] },
            v2: { type: 'list', items: ['Amount', '% of TSI', 'Number of days'] }
          },
          {
            label: 'Occurrence', unchanged: true,
            v1: { type: 'text', text: 'Event / Occurrence' },
            v2: { type: 'text', text: 'Event / Occurrence' }
          },
          {
            label: 'Aggregate type', unchanged: true,
            v1: { type: 'text', text: 'No aggregate' },
            v2: { type: 'text', text: 'No aggregate' }
          },
          {
            label: 'Condition', unchanged: true,
            v1: { type: 'text', text: 'Waiting period' },
            v2: { type: 'text', text: 'Waiting period' }
          },
          {
            label: 'Condition unit',
            v1: { type: 'list', items: ['Days', 'Months'] },
            v2: { type: 'change', change: 'updated', text: 'Days\nMonths\nYears', hasDropdown: true }
          }
        ]
      }
    ]
  },
  {
    title: 'Components',
    subgroups: [
      {
        label: 'Sections', unchanged: true,
        rows: [
          {
            label: 'Property damage', unchanged: true,
            v1: CHECK, v2: CHECK
          },
          {
            label: 'Business Interruption', unchanged: true,
            v1: CHECK, v2: CHECK
          }
        ]
      },
      {
        label: 'Coverages',
        rows: [
          {
            label: 'Unnamed perils', unchanged: true,
            v1: CHECK, v2: CHECK
          },
          {
            label: 'Theft, Burglary and Robbery',
            v1: CHECK, v2: { type: 'change', change: 'removed', hasDropdown: false }
          },
          {
            label: 'Sprinkler Leakage',
            v1: CHECK, v2: { type: 'change', change: 'removed', hasDropdown: false }
          },
          {
            label: 'Water',
            v1: CHECK, v2: { type: 'change', change: 'removed', hasDropdown: false }
          },
          {
            label: 'Cyber',
            v1: CHECK, v2: { type: 'change', change: 'removed', hasDropdown: false }
          },
          {
            label: 'FLEXA', unchanged: true, v1: CHECK, v2: CHECK
          },
          {
            label: 'FLEXA', unchanged: true, v1: CHECK, v2: CHECK
          },
          {
            label: 'Theft, Burglary and Robbery', unchanged: true, v1: CHECK, v2: CHECK
          },
          {
            label: 'Sprinkler Leakage', unchanged: true, v1: CHECK, v2: CHECK
          },
          {
            label: 'Water', unchanged: true, v1: CHECK, v2: CHECK
          },
          {
            label: 'Cyber', unchanged: true, v1: CHECK, v2: CHECK
          }
        ]
      },
      {
        label: 'Exclusions', unchanged: true,
        rows: [
          { label: 'Affirmative CYBER', unchanged: true, v1: CHECK, v2: CHECK },
          { label: 'Asbestos', unchanged: true, v1: CHECK, v2: CHECK },
          { label: 'Crime, Fidelity', unchanged: true, v1: CHECK, v2: CHECK },
          { label: 'Delay, Loss of Use, Loss of Market', unchanged: true, v1: CHECK, v2: CHECK },
          { label: 'Faulty workmanship', unchanged: true, v1: CHECK, v2: CHECK }
        ]
      },
      {
        label: 'Extensions', unchanged: true,
        rows: [
          { label: 'Accidental Leakage or Spillage', unchanged: true, v1: CHECK, v2: CHECK },
          { label: 'Accumulated Stocks', unchanged: true, v1: CHECK, v2: CHECK },
          { label: 'Advanced Business Interruption (Profit or Rent)', unchanged: true, v1: CHECK, v2: CHECK },
          { label: 'Alterations or Automatic Coverage For Existing Locations', unchanged: true, v1: CHECK, v2: CHECK },
          { label: 'Appraisements', unchanged: true, v1: CHECK, v2: CHECK }
        ]
      },
      {
        label: 'Writebacks',
        rows: [
          { label: 'CBI Digital Supplier Extension Write-back', unchanged: true, v1: CHECK, v2: CHECK },
          { label: 'CBI - Accidental Failure Of Supply Write-back', unchanged: true, v1: CHECK, v2: CHECK },
          {
            label: 'Digital Business Interruption_Write-back',
            v1: DASH,
            v2: { type: 'change', change: 'new-component', hasDropdown: true }
          },
          { label: 'Flood_Write-back', unchanged: true, v1: CHECK, v2: CHECK },
          { label: 'Infrastructure System Coverage Write-back', unchanged: true, v1: CHECK, v2: CHECK }
        ]
      }
    ]
  },
  {
    title: 'Localisations',
    rows: [
      {
        label: 'Germany property product',
        v1: CHECK, v2: { type: 'change', change: 'removed', hasDropdown: false }
      },
      {
        label: 'France property product',
        v1: CHECK, v2: { type: 'change', change: 'updated', hasDropdown: false }
      },
      {
        label: 'Denmark property product', unchanged: true,
        v1: CHECK, v2: CHECK
      },
      {
        label: 'Netherlands property product',
        v1: DASH, v2: { type: 'change', change: 'new-localisation', hasDropdown: true }
      },
      {
        label: 'Switzerland property product',
        v1: DASH, v2: { type: 'change', change: 'new-localisation', hasDropdown: true }
      }
    ]
  }
];
