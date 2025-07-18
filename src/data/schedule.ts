import { TimeBlock } from '../types/schedule';

export const scheduleData: TimeBlock[] = [
  {
    id: 'startup',
    startTime: '07:50',
    endTime: '08:00',
    title: 'Opstart',
    emoji: '🌅',
    tasks: [
      { id: 'startup-1', text: 'PC aanzetten', completed: false },
      { id: 'startup-2', text: 'Koffie/thee pakken', completed: false },
      { id: 'startup-3', text: 'Agenda openen', completed: false }
    ],
    why: 'Rustig opstarten helpt je mentaal voorbereiden op de dag',
    whyNow: 'Vóór de drukte begint, zodat je met overzicht start'
  },
  {
    id: 'morning-review',
    startTime: '08:00',
    endTime: '08:25',
    title: 'Beoordelen bak (ochtendronde)',
    emoji: '📥',
    tasks: [
      { id: 'morning-review-1', text: 'Nieuwe tickets bekijken', completed: false },
      { id: 'morning-review-2', text: 'Tickets beoordelen', completed: false },
      { id: 'morning-review-3', text: 'Prioriteiten stellen', completed: false }
    ],
    why: 'Hiermee bepaal je wat écht belangrijk is vandaag',
    whyNow: 'Vóór de support- en dev-standup moet je weten wat je gaat doen'
  },
  {
    id: 'standup-prep',
    startTime: '08:25',
    endTime: '08:30',
    title: 'Voorbereiding support standup',
    emoji: '📋',
    tasks: [
      { id: 'standup-prep-1', text: 'Planning doornemen', completed: false },
      { id: 'standup-prep-2', text: 'Haalbaarheid inschatten', completed: false }
    ],
    why: 'Zodat je gericht en realistisch kunt communiceren in de standup',
    whyNow: 'Direct vóór de standup, met de laatste info uit de beoordelen bak'
  },
  {
    id: 'morning-standup',
    startTime: '08:30',
    endTime: '08:35',
    title: 'Support standup (ochtend)',
    emoji: '🧍',
    tasks: [
      { id: 'morning-standup-1', text: 'Wat ga je doen delen', completed: false },
      { id: 'morning-standup-2', text: 'Haalbaarheid inschatten', completed: false },
      { id: 'morning-standup-3', text: 'Eventuele hulpvragen bespreken', completed: false }
    ],
    why: 'Het team moet weten wat jij oppakt en of je hulp nodig hebt',
    whyNow: 'Zodat iedereen direct na de meeting gericht aan de slag kan'
  },
  {
    id: 'dev-meeting',
    startTime: '08:35',
    endTime: '09:00',
    title: 'Overleg met dev + tickets aanmaken in Jira',
    emoji: '🤝',
    tasks: [
      { id: 'dev-meeting-1', text: 'Dev-overdracht bespreken', completed: false },
      { id: 'dev-meeting-2', text: 'Jira-tickets aanmaken', completed: false }
    ],
    why: 'Ontwikkelaars hebben heldere input nodig om efficiënt te werken',
    whyNow: 'Ze starten hun werkdag; jouw input moet er vóór hun focusblok zijn'
  },
  {
    id: 'focus-block',
    startTime: '09:00',
    endTime: '11:00',
    title: 'Focusblok: belangrijke tickets',
    emoji: '🚨',
    tasks: [
      { id: 'focus-block-1', text: 'Urgente/complexe tickets uitvoeren', completed: false }
    ],
    why: 'Dit zijn de kern van je werkzaamheden en vragen veel denkkracht',
    whyNow: 'Je hebt nog maximale focus en minder verstoringen in de ochtend'
  },
  {
    id: 'mini-check-1',
    startTime: '09:45',
    endTime: '09:50',
    title: 'Mini check beoordelen bak',
    emoji: '🔁',
    tasks: [
      { id: 'mini-check-1-1', text: 'Check of er nieuwe urgente tickets zijn', completed: false }
    ],
    why: 'Korte controle om geen urgente zaken te missen',
    whyNow: 'Tussentijdse check tijdens focusblok',
    isRecurring: true
  },
  {
    id: 'medium-tickets',
    startTime: '11:00',
    endTime: '12:30',
    title: 'Middelmatige tickets + communicatie',
    emoji: '📬',
    tasks: [
      { id: 'medium-tickets-1', text: 'Klantreacties beantwoorden', completed: false },
      { id: 'medium-tickets-2', text: 'Normale tickets afhandelen', completed: false }
    ],
    why: 'Belangrijk voor klanttevredenheid en voortgang',
    whyNow: 'Je hebt al de grootste knelpunten aangepakt, nu de rest'
  },
  {
    id: 'mini-check-2',
    startTime: '12:15',
    endTime: '12:20',
    title: 'Mini check beoordelen bak',
    emoji: '🔁',
    tasks: [
      { id: 'mini-check-2-1', text: 'Check of er nog urgente tickets zijn voor lunchpauze', completed: false }
    ],
    why: 'Zorgen dat geen urgente zaken wachten tijdens lunch',
    whyNow: 'Laatste check vóór lunchpauze',
    isRecurring: true
  },
  {
    id: 'lunch',
    startTime: '12:30',
    endTime: '13:00',
    title: 'Lunchpauze',
    emoji: '🍽️',
    tasks: [],
    why: 'Tijd om fysiek en mentaal bij te tanken',
    whyNow: 'Gebalanceerde rust halverwege de dag voor herstel'
  },
  {
    id: 'low-priority',
    startTime: '13:00',
    endTime: '15:00',
    title: 'Minder dringende tickets + ad-hoc',
    emoji: '🧩',
    tasks: [
      { id: 'low-priority-1', text: 'Tickets met lage prioriteit behandelen', completed: false },
      { id: 'low-priority-2', text: 'Ondersteuning bieden waar nodig', completed: false }
    ],
    why: 'Houdt de wachtrij schoon en maakt ruimte voor morgen',
    whyNow: 'Je energieniveau is lager; deze taken vragen minder denkvermogen'
  },
  {
    id: 'mini-check-3',
    startTime: '13:45',
    endTime: '13:50',
    title: 'Mini check beoordelen bak',
    emoji: '🔁',
    tasks: [
      { id: 'mini-check-3-1', text: 'Check of prioriteiten zijn veranderd', completed: false }
    ],
    why: 'Controleren of er nieuwe urgente zaken zijn',
    whyNow: 'Tussentijdse check tijdens middag',
    isRecurring: true
  },
  {
    id: 'dev-handover',
    startTime: '15:00',
    endTime: '16:00',
    title: 'Voorbereiden overdracht naar development',
    emoji: '📝',
    tasks: [
      { id: 'dev-handover-1', text: 'Tickets selecteren voor dev', completed: false },
      { id: 'dev-handover-2', text: 'Duidelijke omschrijvingen maken', completed: false }
    ],
    why: 'Developers kunnen alleen door als jij helder bent over wat je verwacht',
    whyNow: 'Zo hebben zij je input de volgende ochtend paraat'
  },
  {
    id: 'final-check',
    startTime: '15:50',
    endTime: '15:55',
    title: 'Laatste check beoordelen bak',
    emoji: '🔁',
    tasks: [
      { id: 'final-check-1', text: 'Check op nieuwe urgente tickets', completed: false }
    ],
    why: 'Laatste controle van de dag',
    whyNow: 'Vóór afronden van werkdag',
    isRecurring: true
  },
  {
    id: 'flex-block',
    startTime: '16:00',
    endTime: '16:30',
    title: 'Flexblok + afronden',
    emoji: '🔄',
    tasks: [
      { id: 'flex-block-1', text: 'Laatste openstaande tickets afronden', completed: false },
      { id: 'flex-block-2', text: 'Voorbereiden op einde werkdag', completed: false }
    ],
    why: 'Vermijdt dat werk doorschuift zonder plan',
    whyNow: 'Even lucht tussen dev-overdracht en support standup'
  },
  {
    id: 'afternoon-standup',
    startTime: '16:30',
    endTime: '16:45',
    title: 'Support standup (middag)',
    emoji: '🧍',
    tasks: [
      { id: 'afternoon-standup-1', text: 'Evalueren of taken zijn afgerond', completed: false },
      { id: 'afternoon-standup-2', text: 'Eventuele blockers bespreken', completed: false }
    ],
    why: 'Reflectie helpt het team en jezelf verbeteren',
    whyNow: 'Einde dagmoment om de balans op te maken'
  },
  {
    id: 'day-closure',
    startTime: '16:45',
    endTime: '17:00',
    title: 'Dag afsluiten & vooruitkijken',
    emoji: '📅',
    tasks: [
      { id: 'day-closure-1', text: 'Niet afgeronde taken inplannen', completed: false },
      { id: 'day-closure-2', text: 'Mailbox ordenen', completed: false }
    ],
    why: 'Zo sluit je met rust af en weet je wat er morgen moet gebeuren',
    whyNow: 'Laatste kwartier gebruiken om overzicht te houden'
  }
];