import type { Tag, Author, Article, Producer, CabinetItem, NavItem, StudyItem } from '@/types';

export const navItems: NavItem[] = [
  { label: 'Keywords', href: '#keywords' },
  { label: 'Research', href: '#research' },
  { label: 'Studies', href: '#studies' },
  { label: 'Activities', href: '#activities' },
  { label: 'Collaborator', href: '#collaborator' },
];

export const tagColors = [
  'tag-green',
  'tag-blue',
  'tag-purple',
  'tag-pink',
  'tag-orange',
  'tag-red',
  'tag-teal',
  'tag-indigo',
  'tag-cyan',
  'tag-lime',
  'tag-amber',
  'tag-rose',
  'tag-violet',
  'tag-fuchsia',
  'tag-sky',
];

export const tags: Tag[] = [
  { id: '1', name: 'Memory', color: 'tag-green' },
  { id: '2', name: 'Embodied Writing', color: 'tag-blue' },
  { id: '3', name: 'Research Practice', color: 'tag-purple' },
  { id: '4', name: 'Editorial Method', color: 'tag-pink' },
  { id: '5', name: 'Critical Platform', color: 'tag-orange' },
  { id: '6', name: 'Subculture', color: 'tag-red' },
  { id: '7', name: 'Grid Island', color: 'tag-teal' },
  { id: '8', name: 'Asian Contemporary Art', color: 'tag-indigo' },
  { id: '9', name: 'Copy and Archive', color: 'tag-cyan' },
  { id: '10', name: 'Affect', color: 'tag-lime' },
  { id: '11', name: 'Generation', color: 'tag-amber' },
  { id: '12', name: 'Workshop', color: 'tag-rose' },
  { id: '13', name: 'Literacy', color: 'tag-violet' },
  { id: '14', name: 'Collective Lab', color: 'tag-fuchsia' },
  { id: '15', name: 'Care', color: 'tag-sky' },
  { id: '16', name: 'Field Practice', color: 'tag-emerald' },
  { id: '17', name: 'Listening', color: 'tag-green' },
  { id: '18', name: 'Underground Scene', color: 'tag-blue' },
  { id: '19', name: 'Witness', color: 'tag-purple' },
  { id: '20', name: 'Diffusion', color: 'tag-pink' },
  { id: '21', name: 'Circuit Bending', color: 'tag-orange' },
  { id: '22', name: 'Tech and Media', color: 'tag-red' },
  { id: '23', name: 'Ghost Image', color: 'tag-teal' },
  { id: '24', name: 'Gender', color: 'tag-indigo' },
  { id: '25', name: 'Digital Artwork', color: 'tag-cyan' },
  { id: '26', name: 'Monument', color: 'tag-lime' },
  { id: '27', name: 'Incomplete Future', color: 'tag-amber' },
  { id: '28', name: 'Ruins', color: 'tag-rose' },
  { id: '29', name: 'Diffraction', color: 'tag-violet' },
  { id: '30', name: 'Synthesis', color: 'tag-fuchsia' },
  { id: '31', name: 'Surface', color: 'tag-sky' },
  { id: '32', name: 'Creation', color: 'tag-emerald' },
  { id: '33', name: 'Film', color: 'tag-green' },
  { id: '34', name: 'Activism', color: 'tag-blue' },
  { id: '35', name: 'Accessibility', color: 'tag-purple' },
  { id: '36', name: 'Residency', color: 'tag-pink' },
  { id: '37', name: 'Icon', color: 'tag-orange' },
  { id: '38', name: 'Non-Visitor', color: 'tag-red' },
  { id: '39', name: 'Abstraction', color: 'tag-teal' },
  { id: '40', name: 'Data Analysis', color: 'tag-indigo' },
  { id: '41', name: 'Local-first Knowledge', color: 'tag-cyan' },
  { id: '42', name: 'Alliance', color: 'tag-lime' },
  { id: '43', name: 'Independent Publishing', color: 'tag-amber' },
  { id: '44', name: 'Peer Community', color: 'tag-rose' },
  { id: '45', name: 'Digital Literacy', color: 'tag-violet' },
  { id: '46', name: 'Handmade Web', color: 'tag-fuchsia' },
  { id: '47', name: 'Tech Uncanny', color: 'tag-sky' },
  { id: '48', name: 'Material Technique', color: 'tag-emerald' },
  { id: '49', name: 'Knowledge Platform', color: 'tag-green' },
  { id: '50', name: 'Planetary Scale', color: 'tag-blue' },
  { id: '51', name: 'Materiality', color: 'tag-purple' },
  { id: '52', name: 'Data Visualization', color: 'tag-pink' },
  { id: '53', name: 'Art and Technology', color: 'tag-orange' },
  { id: '54', name: 'Sonic Environment', color: 'tag-red' },
  { id: '55', name: 'Craftivism', color: 'tag-teal' },
  { id: '56', name: 'Authorship', color: 'tag-indigo' },
  { id: '57', name: 'Open Access', color: 'tag-cyan' },
  { id: '58', name: 'Speculative Fiction', color: 'tag-lime' },
  { id: '59', name: 'Web Publishing', color: 'tag-amber' },
  { id: '60', name: 'Letter Form', color: 'tag-rose' },
  { id: '61', name: 'Healing', color: 'tag-violet' },
  { id: '62', name: 'Art Object', color: 'tag-fuchsia' },
  { id: '63', name: 'Ritual', color: 'tag-sky' },
  { id: '64', name: 'Sound Experience', color: 'tag-emerald' },
  { id: '65', name: 'Body Politics', color: 'tag-green' },
  { id: '66', name: 'Game Culture', color: 'tag-blue' },
  { id: '67', name: 'Data Mining', color: 'tag-purple' },
  { id: '68', name: 'Plain Language', color: 'tag-pink' },
  { id: '69', name: 'Curatorial Research', color: 'tag-orange' },
  { id: '70', name: 'Visuality', color: 'tag-red' },
  { id: '71', name: 'Documentation', color: 'tag-teal' },
  { id: '72', name: 'Urban Ecology', color: 'tag-indigo' },
];

export const authors: Author[] = [
  { id: '1', name: 'Jung Hyun', bio: 'Artist researching acceleration and temporal pressure in contemporary life.' },
  { id: '2', name: 'Jung-Hyeon Kwon', bio: 'Art critic and editor.' },
  { id: '3', name: 'Yujin Park', bio: 'Art writer focused on institutional critique.' },
  { id: '4', name: 'Taegyun Yoon', bio: 'Critic working on social form and exhibition structures.' },
  { id: '5', name: 'Yuki Konno', bio: 'Japan-based critic and researcher.' },
  { id: '6', name: 'Moonhee Han', bio: 'Writer on youth policy and art labor.' },
  { id: '7', name: 'Cheonseok Oh', bio: 'Artist and member of a writing-based collective.' },
  { id: '8', name: 'Yeju Son', bio: 'Coordinator supporting research and publishing programs.' },
];

// TODO: 실제 Research 항목으로 채우기 — 타일은 유지, 내용은 비워 둠
export const articles: Article[] = [
  { id: '1', title: '', authors: [], description: '', tags: [], category: '', isNew: false },
  { id: '2', title: '', authors: [], description: '', tags: [], category: '', isNew: false },
  { id: '3', title: '', authors: [], description: '', tags: [], category: '', isNew: false },
  { id: '4', title: '', authors: [], description: '', tags: [], category: '', isNew: false },
  { id: '5', title: '', authors: [], description: '', tags: [], category: '', isNew: false },
  { id: '6', title: '', authors: [], description: '', tags: [], category: '', isNew: false },
];

// TODO: 실제 Studies 항목으로 채우기 — 현재 비어 있어 섹션은 placeholder 상태로 표시됨
export const studies: StudyItem[] = [];

// TODO: 실제 Activities 항목으로 채우기 — 타일은 유지, 내용은 비워 둠
export const producers: Producer[] = [
  { id: '1', name: '', bio: '', role: '' },
  { id: '2', name: '', bio: '', role: '' },
  { id: '3', name: '', bio: '', role: '' },
  { id: '4', name: '', bio: '', role: '' },
  { id: '5', name: '', bio: '', role: '' },
  { id: '6', name: '', bio: '', role: '' },
  { id: '7', name: '', bio: '', role: '' },
  { id: '8', name: '', bio: '', role: '' },
];

// TODO: 실제 Collaborator 항목으로 채우기 — 타일은 유지, 내용은 비워 둠
export const cabinetItems: CabinetItem[] = [
  { id: '1', title: '', subtitle: '', author: '', location: '', description: '' },
  { id: '2', title: '', subtitle: '', author: '', location: '', description: '' },
  { id: '3', title: '', subtitle: '', author: '', location: '', description: '' },
];

export const aboutContent = {
  title: 'Independent research and publishing archive',
  subtitle: 'Archive',
  description: `Archive of Gyuyoung Park is a personal platform for collecting, editing, and publishing research around contemporary art and culture.

The project connects writing, conversation, and documentation into one evolving index where ideas can be revisited and reorganized over time.

It is built as a living structure: open to updates, collaborative references, and long-term editorial experimentation.`,
};

export const footerCredits = {
  publisher: 'Gyuyoung Park',
  editors: [
    { name: 'Gyuyoung Park', period: '2024-' },
    { name: 'Archive Contributors', period: 'ongoing' },
  ],
  assistantEditors: [{ name: 'Research Assistants', period: 'ongoing' }],
  proofreaders: [{ name: 'Editorial Partners', period: 'ongoing' }],
  guestEditor: { name: 'Invited Collaborators', note: 'Rotating contributors' },
  webDirector: { name: 'Gyuyoung Park', company: 'Archive Studio' },
  logoDesign: 'Custom wordmark',
  typeface: 'Pretendard',
  publisherOrg: 'Archive of Gyuyoung Park',
  issn: '2799-3892 (Online)',
  copyright:
    '吏?2024-2026 Archive of Gyuyoung Park. All rights reserved. Content may not be reproduced without permission.',
};
